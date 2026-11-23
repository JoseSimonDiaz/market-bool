import {
  and as cumplenTodas,
  asc as ascendente,
  eq as esIgualA,
  lt as esMenorQue,
  sql as expresionSql,
  type SQL,
} from 'drizzle-orm';
import {
  baseDeDatos,
  ejecutarEnTransaccionSerializada,
  type Transaccion,
} from '@/basedatos/conexion';
import { COLUMNAS_BUSQUEDA_PRODUCTOS } from '@/basedatos/busquedas';
import {
  condicionDeBusqueda,
  condicionDeEstado,
  consultarPagina,
  type Paginado,
} from '@/basedatos/consultas';
import { categorias, productos } from '@/basedatos/esquema';
import {
  ESTADO_FILTRO,
  MOTIVO_STOCK_INICIAL,
  MOVIMIENTO_STOCK,
} from '@/constantes/dominio';
import { ERRORES } from '@/constantes/errores';
import { esquemaId } from '@/esquemas/comunes';
import {
  esquemaAltaProducto,
  esquemaEdicionProducto,
  esquemaFiltroProductos,
  type FiltroProductos,
} from '@/esquemas/productos';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { exigirCategoriaActiva } from '@/servicios/categorias';
import { crearError } from '@/servicios/errores';
import { exigirAdmin } from '@/servicios/permisos';
import { exigirValorUnico, hayCambios } from '@/servicios/reglas-comunes';
import { moverStock } from '@/servicios/stock';

const estaBajoMinimo = esMenorQue(productos.existencia, productos.stockMinimo);

const columnasProducto = {
  id: productos.id,
  codigo: productos.codigo,
  descripcion: productos.descripcion,
  categoria: { id: categorias.id, nombre: categorias.nombre },
  precio: productos.precio,
  existencia: productos.existencia,
  stockMinimo: productos.stockMinimo,
  bajoMinimo: expresionSql<boolean>`${estaBajoMinimo}`.mapWith(Boolean),
  activo: productos.activo,
};

const seleccionarProductos = () =>
  baseDeDatos
    .select(columnasProducto)
    .from(productos)
    .innerJoin(categorias, esIgualA(categorias.id, productos.categoriaId));

export type Producto = Awaited<ReturnType<typeof seleccionarProductos>>[number];

function condicionesDeFiltro(
  usuarioActual: UsuarioSesion,
  filtros: FiltroProductos
) {
  if (filtros.estado !== ESTADO_FILTRO.activos) exigirAdmin(usuarioActual);
  return cumplenTodas(
    condicionDeEstado(productos.activo, filtros.estado),
    condicionDeBusqueda(COLUMNAS_BUSQUEDA_PRODUCTOS, filtros.q),
    filtros.categoriaId
      ? esIgualA(productos.categoriaId, filtros.categoriaId)
      : undefined,
    filtros.bajoMinimo ? estaBajoMinimo : undefined
  );
}

function buscarFilasDeProductos(condiciones: SQL | undefined) {
  return (limite: number, desplazamiento: number) =>
    seleccionarProductos()
      .where(condiciones)
      .orderBy(ascendente(productos.codigo))
      .limit(limite)
      .offset(desplazamiento);
}

function exigirCodigoLibre(codigo: string, idExcluido?: number) {
  return exigirValorUnico({
    tabla: productos,
    columna: productos.codigo,
    valorBuscado: codigo,
    idExcluido,
    errorSiExiste: ERRORES.CODIGO_DUPLICADO,
    campo: esquemaAltaProducto.keyof().enum.codigo,
  });
}

// Catálogo: listado con búsqueda, filtro por categoría y marca de bajo mínimo.
export async function listarProductos(
  usuarioActual: UsuarioSesion,
  filtrosSinValidar: unknown
): Promise<Paginado<Producto>> {
  const filtros = esquemaFiltroProductos.parse(filtrosSinValidar);
  const condiciones = condicionesDeFiltro(usuarioActual, filtros);
  return consultarPagina({
    page: filtros.page,
    pageSize: filtros.pageSize,
    total: baseDeDatos.$count(productos, condiciones),
    buscarFilas: buscarFilasDeProductos(condiciones),
  });
}

// Catálogo: listado con búsqueda, filtro por categoría y marca de bajo mínimo.
export async function obtenerProducto(
  _usuarioActual: UsuarioSesion,
  idSinValidar: unknown
): Promise<Producto> {
  const productoId = esquemaId.parse(idSinValidar);
  const [producto] = await seleccionarProductos().where(
    esIgualA(productos.id, productoId)
  );
  if (!producto) throw crearError(ERRORES.NO_ENCONTRADO);
  return producto;
}

type AltaDeProducto = Omit<
  ReturnType<typeof esquemaAltaProducto.parse>,
  'stockInicial'
>;

type ProductoNuevo = {
  alta: AltaDeProducto;
  stockInicial?: number;
  usuarioId: number;
};

async function insertarConStockInicial(
  transaccion: Transaccion,
  { alta, stockInicial, usuarioId }: ProductoNuevo
) {
  const [creado] = await transaccion
    .insert(productos)
    .values(alta)
    .returning({ id: productos.id });
  if (!stockInicial) return creado.id;
  await moverStock(transaccion, {
    productoId: creado.id,
    cantidadConSigno: stockInicial,
    tipo: MOVIMIENTO_STOCK.ingreso,
    motivo: MOTIVO_STOCK_INICIAL,
    usuarioId,
  });
  return creado.id;
}

// Alta y edición de productos: código único y existencia que no se edita a mano.
// Ingreso de stock: cantidad y motivo; el stock inicial entra como ingreso.
// Todo cambio de stock graba un movimiento en la misma transacción.
export async function crearProducto(
  usuarioActual: UsuarioSesion,
  altaSinValidar: unknown
): Promise<Producto> {
  const { stockInicial, ...alta } = esquemaAltaProducto.parse(altaSinValidar);
  exigirAdmin(usuarioActual);
  await exigirCategoriaActiva(alta.categoriaId);
  await exigirCodigoLibre(alta.codigo);
  const productoId = await ejecutarEnTransaccionSerializada((transaccion) =>
    insertarConStockInicial(transaccion, {
      alta,
      stockInicial,
      usuarioId: usuarioActual.id,
    })
  );
  return obtenerProducto(usuarioActual, productoId);
}

// Alta y edición de productos: código único y existencia que no se edita a mano.
// Baja lógica de productos: queda inactivo pero conserva su historial.
export async function editarProducto(
  usuarioActual: UsuarioSesion,
  idSinValidar: unknown,
  cambiosSinValidar: unknown
): Promise<Producto> {
  const productoId = esquemaId.parse(idSinValidar);
  const cambios = esquemaEdicionProducto.parse(cambiosSinValidar);
  exigirAdmin(usuarioActual);
  await obtenerProducto(usuarioActual, productoId);
  if (cambios.categoriaId) await exigirCategoriaActiva(cambios.categoriaId);
  if (cambios.codigo) await exigirCodigoLibre(cambios.codigo, productoId);
  if (hayCambios(cambios)) {
    await baseDeDatos
      .update(productos)
      .set(cambios)
      .where(esIgualA(productos.id, productoId));
  }
  return obtenerProducto(usuarioActual, productoId);
}
