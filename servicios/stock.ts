import {
  and as cumplenTodas,
  desc as descendente,
  eq as esIgualA,
  gte as esMayorOIgualA,
  sql as expresionSql,
  type SQL,
} from 'drizzle-orm';
import {
  baseDeDatos,
  ejecutarEnTransaccionSerializada,
  type Ejecutor,
} from '@/basedatos/conexion';
import {
  condicionDesdeElDia,
  condicionHastaElDia,
  consultarPagina,
  type Paginado,
} from '@/basedatos/consultas';
import {
  facturas,
  movimientosStock,
  productos,
  usuarios,
} from '@/basedatos/esquema';
import {
  EXISTENCIA_MINIMA,
  SIGNO_MOVIMIENTO_MANUAL,
  type TipoMovimientoStock,
} from '@/constantes/dominio';
import { ERRORES } from '@/constantes/errores';
import { esquemaId } from '@/esquemas/comunes';
import {
  esquemaFiltroMovimientos,
  esquemaMovimientoManual,
} from '@/esquemas/productos';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { crearError } from '@/servicios/errores';
import { exigirAdmin } from '@/servicios/permisos';

export type DatosMovimiento = {
  productoId: number;
  cantidadConSigno: number;
  tipo: TipoMovimientoStock;
  motivo: string;
  usuarioId: number;
  facturaId?: number;
  observacion?: string | null;
};

type FiltrosDeMovimientos = ReturnType<typeof esquemaFiltroMovimientos.parse>;

async function informarStockInsuficiente(
  ejecutor: Ejecutor,
  { productoId, cantidadConSigno }: DatosMovimiento
): Promise<never> {
  const [producto] = await ejecutor
    .select({ existencia: productos.existencia })
    .from(productos)
    .where(esIgualA(productos.id, productoId));
  if (!producto) throw crearError(ERRORES.NO_ENCONTRADO);
  throw crearError(ERRORES.STOCK_INSUFICIENTE, [
    {
      productoId,
      solicitado: -cantidadConSigno,
      disponible: producto.existencia,
    },
  ]);
}

async function actualizarExistenciaSiAlcanza(
  ejecutor: Ejecutor,
  { productoId, cantidadConSigno }: DatosMovimiento
) {
  const existenciaResultante = expresionSql`${productos.existencia} + ${cantidadConSigno}`;
  const [productoActualizado] = await ejecutor
    .update(productos)
    .set({ existencia: existenciaResultante })
    .where(
      cumplenTodas(
        esIgualA(productos.id, productoId),
        esMayorOIgualA(existenciaResultante, EXISTENCIA_MINIMA)
      )
    )
    .returning({ existencia: productos.existencia });
  return productoActualizado;
}

async function registrarEnHistorial(
  ejecutor: Ejecutor,
  movimiento: DatosMovimiento,
  existenciaResultante: number
) {
  const { cantidadConSigno, ...datosDelMovimiento } = movimiento;
  const [movimientoInsertado] = await ejecutor
    .insert(movimientosStock)
    .values({
      ...datosDelMovimiento,
      cantidad: cantidadConSigno,
      existenciaResultante,
    })
    .returning({ id: movimientosStock.id });
  return movimientoInsertado.id;
}

// La existencia nunca es negativa, ni con dos ventas simultáneas.
// Todo cambio de stock graba un movimiento en la misma transacción.
export async function moverStock(
  ejecutor: Ejecutor,
  movimiento: DatosMovimiento
) {
  const productoActualizado = await actualizarExistenciaSiAlcanza(
    ejecutor,
    movimiento
  );
  if (!productoActualizado) {
    return informarStockInsuficiente(ejecutor, movimiento);
  }
  const { existencia } = productoActualizado;
  const id = await registrarEnHistorial(ejecutor, movimiento, existencia);
  return { id, existencia };
}

const columnasMovimiento = {
  id: movimientosStock.id,
  producto: {
    id: productos.id,
    codigo: productos.codigo,
    descripcion: productos.descripcion,
  },
  tipo: movimientosStock.tipo,
  cantidad: movimientosStock.cantidad,
  existenciaResultante: movimientosStock.existenciaResultante,
  motivo: movimientosStock.motivo,
  observacion: movimientosStock.observacion,
  referencia: {
    facturaId: facturas.id,
    puntoVenta: facturas.puntoVenta,
    numero: facturas.numero,
  },
  usuario: { id: usuarios.id, nombre: usuarios.nombre },
  fecha: movimientosStock.fecha,
};

const seleccionarMovimientos = () =>
  baseDeDatos
    .select(columnasMovimiento)
    .from(movimientosStock)
    .innerJoin(productos, esIgualA(productos.id, movimientosStock.productoId))
    .innerJoin(usuarios, esIgualA(usuarios.id, movimientosStock.usuarioId))
    .leftJoin(facturas, esIgualA(facturas.id, movimientosStock.facturaId));

export type MovimientoStock = Awaited<
  ReturnType<typeof seleccionarMovimientos>
>[number];

function condicionesDeMovimientos(filtros: FiltrosDeMovimientos) {
  return cumplenTodas(
    filtros.productoId
      ? esIgualA(movimientosStock.productoId, filtros.productoId)
      : undefined,
    filtros.tipo ? esIgualA(movimientosStock.tipo, filtros.tipo) : undefined,
    condicionDesdeElDia(movimientosStock.fecha, filtros.desde),
    condicionHastaElDia(movimientosStock.fecha, filtros.hasta)
  );
}

function buscarFilasDeMovimientos(condiciones: SQL | undefined) {
  return (limite: number, desplazamiento: number) =>
    seleccionarMovimientos()
      .where(condiciones)
      .orderBy(
        descendente(movimientosStock.fecha),
        descendente(movimientosStock.id)
      )
      .limit(limite)
      .offset(desplazamiento);
}

function consultarMovimientos(filtros: FiltrosDeMovimientos) {
  const condiciones = condicionesDeMovimientos(filtros);
  return consultarPagina({
    page: filtros.page,
    pageSize: filtros.pageSize,
    total: baseDeDatos.$count(movimientosStock, condiciones),
    buscarFilas: buscarFilasDeMovimientos(condiciones),
  });
}

// Movimientos de stock: historial con fecha, tipo, cantidad, resultante y usuario.
export async function listarMovimientosProducto(
  _usuarioActual: UsuarioSesion,
  productoIdSinValidar: unknown,
  filtrosSinValidar: unknown
): Promise<Paginado<MovimientoStock>> {
  const productoId = esquemaId.parse(productoIdSinValidar);
  const filtros = esquemaFiltroMovimientos.parse(filtrosSinValidar);
  return consultarMovimientos({ ...filtros, productoId });
}

// Movimientos de stock: historial con fecha, tipo, cantidad, resultante y usuario.
export async function listarMovimientos(
  _usuarioActual: UsuarioSesion,
  filtrosSinValidar: unknown
): Promise<Paginado<MovimientoStock>> {
  return consultarMovimientos(
    esquemaFiltroMovimientos.parse(filtrosSinValidar)
  );
}

function aMovimientoConSigno(
  productoId: number,
  movimientoManual: ReturnType<typeof esquemaMovimientoManual.parse>,
  usuarioId: number
): DatosMovimiento {
  const signo = SIGNO_MOVIMIENTO_MANUAL[movimientoManual.tipo];
  return {
    productoId,
    usuarioId,
    cantidadConSigno: signo * movimientoManual.cantidad,
    tipo: movimientoManual.tipo,
    motivo: movimientoManual.motivo,
    observacion: movimientoManual.observacion,
  };
}

async function buscarMovimientoConDetalle(movimientoId: number) {
  const [movimientoConDetalle] = await seleccionarMovimientos().where(
    esIgualA(movimientosStock.id, movimientoId)
  );
  return movimientoConDetalle;
}

// Ingreso de stock: cantidad y motivo; el stock inicial entra como ingreso.
// Egreso de stock: motivo obligatorio y nunca deja la existencia en negativo.
// La existencia nunca es negativa, ni con dos ventas simultáneas.
// Todo cambio de stock graba un movimiento en la misma transacción.
export async function registrarMovimientoManual(
  usuarioActual: UsuarioSesion,
  productoIdSinValidar: unknown,
  movimientoSinValidar: unknown
) {
  const productoId = esquemaId.parse(productoIdSinValidar);
  const movimientoManual = esquemaMovimientoManual.parse(movimientoSinValidar);
  exigirAdmin(usuarioActual);
  const movimiento = aMovimientoConSigno(
    productoId,
    movimientoManual,
    usuarioActual.id
  );
  const { id } = await ejecutarEnTransaccionSerializada((transaccion) =>
    moverStock(transaccion, movimiento)
  );
  return buscarMovimientoConDetalle(id);
}
