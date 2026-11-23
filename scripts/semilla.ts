import {
  asc as ascendente,
  eq as esIgualA,
  lt as esMenorQue,
  sql as expresionSql,
} from 'drizzle-orm';
import { baseDeDatos } from '@/basedatos/conexion';
import * as tablas from '@/basedatos/esquema';
import { saldosPorCliente } from '@/basedatos/saldos';
import {
  ANULACION_DE_PRUEBA,
  CALENDARIO_DE_PRUEBA,
  CATEGORIAS_DE_PRUEBA,
  CLIENTES_DE_PRUEBA,
  PAGOS_DE_PRUEBA,
  PLANTILLAS_DE_VENTA,
  PRODUCTOS_DE_PRUEBA,
  TARJETAS_DE_PRUEBA,
  USUARIOS_DE_PRUEBA,
  type FilaProducto,
  type PlantillaDeVenta,
} from '@/constantes/datos-de-prueba';
import {
  FORMA_PAGO,
  MEDIOS_PAGO,
  ROL,
  SALDO_SALDADO,
  type Rol,
} from '@/constantes/dominio';
import {
  CENTAVOS_POR_PESO,
  MINUTOS_POR_HORA,
  UN_DIA,
} from '@/constantes/formato';
import { NOMBRE_ARCHIVO_SEMILLA } from '@/constantes/scripts';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import {
  hoyEnArgentina,
  inicioDiaArgentina,
  sumarDias,
  sumarMinutos,
} from '@/lib/fechas';
import { anularFactura } from '@/servicios/anulaciones';
import { buscarUsuarioActivo, hashearPassword } from '@/servicios/auth';
import { crearCategoria } from '@/servicios/categorias';
import { crearCliente, type Cliente } from '@/servicios/clientes';
import type { Factura } from '@/servicios/facturas';
import { registrarPago } from '@/servicios/pagos';
import { crearProducto } from '@/servicios/productos';
import { emitirFactura } from '@/servicios/ventas';

type ContextoDeVentas = {
  operadores: UsuarioSesion[];
  idsPorCodigo: Map<string, number>;
  clientes: Cliente[];
  clientesConCuenta: Cliente[];
  hoy: string;
};

type VentaDelPlan = {
  indice: number;
  plantilla: PlantillaDeVenta;
  numeroDeVentaACuenta: number;
};

async function vaciar() {
  await baseDeDatos.delete(tablas.movimientosCuenta);
  await baseDeDatos.delete(tablas.pagos);
  await baseDeDatos.delete(tablas.movimientosStock);
  await baseDeDatos.delete(tablas.facturaItems);
  await baseDeDatos.delete(tablas.facturas);
  await baseDeDatos.delete(tablas.clientes);
  await baseDeDatos.delete(tablas.productos);
  await baseDeDatos.delete(tablas.categorias);
  await baseDeDatos.delete(tablas.usuarios);
  await baseDeDatos.delete(tablas.numeradores);
}

async function sesionDelRol(rol: Rol) {
  const [usuario] = await baseDeDatos
    .select({ id: tablas.usuarios.id })
    .from(tablas.usuarios)
    .where(esIgualA(tablas.usuarios.rol, rol))
    .orderBy(ascendente(tablas.usuarios.id))
    .limit(1);
  const sesion = await buscarUsuarioActivo(usuario.id);
  if (!sesion) throw new Error(`No se pudo crear el usuario ${rol}.`);
  return sesion;
}

async function crearUsuarios() {
  for (const { password, ...usuario } of USUARIOS_DE_PRUEBA) {
    await baseDeDatos
      .insert(tablas.usuarios)
      .values({ ...usuario, passwordHash: await hashearPassword(password) });
  }
  return [await sesionDelRol(ROL.admin), await sesionDelRol(ROL.vendedor)];
}

async function crearCategorias(admin: UsuarioSesion) {
  const idsCategorias: number[] = [];
  for (const nombre of CATEGORIAS_DE_PRUEBA) {
    idsCategorias.push((await crearCategoria(admin, { nombre })).id);
  }
  return idsCategorias;
}

function altaDeProducto(fila: FilaProducto, idsCategorias: number[]) {
  const [
    codigo,
    descripcion,
    indiceCategoria,
    precioEnPesos,
    stockMinimo,
    stockInicial,
  ] = fila;
  return {
    codigo,
    descripcion,
    categoriaId: idsCategorias[indiceCategoria],
    precio: precioEnPesos * CENTAVOS_POR_PESO,
    stockMinimo,
    stockInicial,
  };
}

async function crearCatalogo(admin: UsuarioSesion) {
  const idsCategorias = await crearCategorias(admin);
  const idsPorCodigo = new Map<string, number>();
  for (const fila of PRODUCTOS_DE_PRUEBA) {
    const alta = altaDeProducto(fila, idsCategorias);
    idsPorCodigo.set(alta.codigo, (await crearProducto(admin, alta)).id);
  }
  return idsPorCodigo;
}

async function crearClientes(admin: UsuarioSesion) {
  const clientes: Cliente[] = [];
  for (const alta of CLIENTES_DE_PRUEBA) {
    clientes.push(await crearCliente(admin, alta));
  }
  return clientes;
}

async function fecharCargaInicial(hoy: string) {
  const fecha = inicioDiaArgentina(
    sumarDias(hoy, -CALENDARIO_DE_PRUEBA.diasConFacturas)
  );
  await baseDeDatos.update(tablas.usuarios).set({ creadoEn: fecha });
  await baseDeDatos.update(tablas.categorias).set({ creadoEn: fecha });
  await baseDeDatos.update(tablas.productos).set({ creadoEn: fecha });
  await baseDeDatos.update(tablas.clientes).set({ creadoEn: fecha });
  await baseDeDatos.update(tablas.movimientosStock).set({ fecha });
}

async function fecharFactura(facturaId: number, fecha: string) {
  await baseDeDatos
    .update(tablas.facturas)
    .set({ fecha })
    .where(esIgualA(tablas.facturas.id, facturaId));
  await baseDeDatos
    .update(tablas.movimientosStock)
    .set({ fecha })
    .where(esIgualA(tablas.movimientosStock.facturaId, facturaId));
  await baseDeDatos
    .update(tablas.movimientosCuenta)
    .set({ fecha })
    .where(esIgualA(tablas.movimientosCuenta.facturaId, facturaId));
}

async function fecharPago(pagoId: number, fecha: string) {
  await baseDeDatos
    .update(tablas.pagos)
    .set({ fecha })
    .where(esIgualA(tablas.pagos.id, pagoId));
  await baseDeDatos
    .update(tablas.movimientosCuenta)
    .set({ fecha })
    .where(esIgualA(tablas.movimientosCuenta.pagoId, pagoId));
}

function momentoDeLaFactura(indice: number, hoy: string) {
  const {
    cantidadDeFacturas,
    diasConFacturas,
    horaDeApertura,
    horasDeAtencion,
  } = CALENDARIO_DE_PRUEBA;
  const posicion = (indice * diasConFacturas) / cantidadDeFacturas;
  const diasAtras = diasConFacturas - UN_DIA - Math.floor(posicion);
  const dia = sumarDias(hoy, -diasAtras);
  if (dia === hoy) return undefined;
  const fraccionDelDia = posicion - Math.floor(posicion);
  const horas = horaDeApertura + fraccionDelDia * horasDeAtencion;
  return sumarMinutos(
    inicioDiaArgentina(dia),
    Math.round(horas * MINUTOS_POR_HORA)
  );
}

function planDeVentas(): VentaDelPlan[] {
  let ventasACuenta = 0;
  return Array.from(
    { length: CALENDARIO_DE_PRUEBA.cantidadDeFacturas },
    (_venta, indice) => {
      const plantilla =
        PLANTILLAS_DE_VENTA[indice % PLANTILLAS_DE_VENTA.length];
      const numeroDeVentaACuenta = ventasACuenta;
      if (plantilla.forma === FORMA_PAGO.cuentaCorriente) ventasACuenta += 1;
      return { indice, plantilla, numeroDeVentaACuenta };
    }
  );
}

function compradorDeLaVenta(contexto: ContextoDeVentas, venta: VentaDelPlan) {
  const { clientes, clientesConCuenta } = contexto;
  if (venta.plantilla.forma === FORMA_PAGO.cuentaCorriente) {
    return clientesConCuenta[
      venta.numeroDeVentaACuenta % clientesConCuenta.length
    ].id;
  }
  const { cadaCuantasAConsumidorFinal } = CALENDARIO_DE_PRUEBA;
  if (venta.indice % cadaCuantasAConsumidorFinal === 0) return null;
  const vuelta = Math.floor(venta.indice / cadaCuantasAConsumidorFinal);
  return clientes[vuelta % clientes.length].id;
}

function pagoDeLaVenta({ plantilla, indice }: VentaDelPlan) {
  if (plantilla.forma !== FORMA_PAGO.tarjeta) return { forma: plantilla.forma };
  const tarjeta = TARJETAS_DE_PRUEBA[indice % TARJETAS_DE_PRUEBA.length];
  return { forma: plantilla.forma, tarjeta };
}

function operadorDeLaVenta(contexto: ContextoDeVentas, venta: VentaDelPlan) {
  const { operadores } = contexto;
  return operadores[venta.indice % operadores.length];
}

function emitirVentaDelPlan(contexto: ContextoDeVentas, venta: VentaDelPlan) {
  return emitirFactura(operadorDeLaVenta(contexto, venta), {
    clienteId: compradorDeLaVenta(contexto, venta),
    items: venta.plantilla.renglones.map(([codigo, cantidad]) => ({
      productoId: contexto.idsPorCodigo.get(codigo),
      cantidad,
    })),
    pago: pagoDeLaVenta(venta),
  });
}

function correspondePagar(venta: VentaDelPlan, factura: Factura) {
  const esVentaACuenta =
    venta.plantilla.forma === FORMA_PAGO.cuentaCorriente && factura.cliente;
  const { cadaCuantasVentasACuenta } = PAGOS_DE_PRUEBA;
  const esLaQueSePaga =
    venta.numeroDeVentaACuenta % cadaCuantasVentasACuenta ===
    PAGOS_DE_PRUEBA.posicionDeLaQueSePaga;
  return Boolean(esVentaACuenta && esLaQueSePaga && factura.saldoCliente);
}

function pagoDeParteDelSaldo(venta: VentaDelPlan, saldo: number) {
  const pesos = Math.round(
    (saldo * PAGOS_DE_PRUEBA.fraccionDelSaldo) / CENTAVOS_POR_PESO
  );
  const numeroDePago = Math.floor(
    venta.numeroDeVentaACuenta / PAGOS_DE_PRUEBA.cadaCuantasVentasACuenta
  );
  return {
    importe: pesos * CENTAVOS_POR_PESO,
    medio: MEDIOS_PAGO[numeroDePago % MEDIOS_PAGO.length],
    observacion: PAGOS_DE_PRUEBA.observacion,
  };
}

async function pagarParteDelSaldo(
  contexto: ContextoDeVentas,
  venta: VentaDelPlan,
  factura: Factura
) {
  if (!correspondePagar(venta, factura) || !factura.cliente) return;
  const saldo = factura.saldoCliente ?? SALDO_SALDADO;
  const recibo = await registrarPago(
    operadorDeLaVenta(contexto, venta),
    factura.cliente.id,
    pagoDeParteDelSaldo(venta, saldo)
  );
  return recibo.id;
}

async function registrarVentaDelPlan(
  contexto: ContextoDeVentas,
  venta: VentaDelPlan
) {
  const factura = await emitirVentaDelPlan(contexto, venta);
  const pagoId = await pagarParteDelSaldo(contexto, venta, factura);
  const fecha = momentoDeLaFactura(venta.indice, contexto.hoy);
  if (!fecha) return factura.id;
  await fecharFactura(factura.id, fecha);
  if (pagoId) {
    await fecharPago(
      pagoId,
      sumarMinutos(fecha, CALENDARIO_DE_PRUEBA.minutosHastaElPago)
    );
  }
  return factura.id;
}

async function registrarVentas(contexto: ContextoDeVentas) {
  const idsFacturas: number[] = [];
  for (const venta of planDeVentas()) {
    idsFacturas.push(await registrarVentaDelPlan(contexto, venta));
  }
  return idsFacturas;
}

async function contarDescuadres() {
  const productosDescuadrados = await baseDeDatos
    .select({ codigo: tablas.productos.codigo })
    .from(tablas.productos)
    .where(
      expresionSql`${tablas.productos.existencia} <> coalesce((select sum(${tablas.movimientosStock.cantidad}) from ${tablas.movimientosStock} where ${tablas.movimientosStock.productoId} = ${tablas.productos.id}), 0)`
    );
  const saldosAFavor = await baseDeDatos
    .select({ clienteId: saldosPorCliente.clienteId })
    .from(saldosPorCliente)
    .where(esMenorQue(expresionSql`${saldosPorCliente.saldo}`, SALDO_SALDADO));
  return { productosDescuadrados, saldosAFavor };
}

export async function verificarInvariantes() {
  const { productosDescuadrados, saldosAFavor } = await contarDescuadres();
  if (productosDescuadrados.length > 0) {
    throw new Error(
      `Stock descuadrado: ${productosDescuadrados.map((productoDescuadrado) => productoDescuadrado.codigo).join(', ')}`
    );
  }
  if (saldosAFavor.length > 0) {
    throw new Error(
      `Clientes con saldo a favor: ${saldosAFavor.map((saldoAFavor) => saldoAFavor.clienteId).join(', ')}`
    );
  }
}

export async function baseVacia() {
  return (await baseDeDatos.$count(tablas.usuarios)) === 0;
}

export async function sembrarCatalogo() {
  await vaciar();
  const operadores = await crearUsuarios();
  const idsPorCodigo = await crearCatalogo(operadores[0]);
  return { operadores, idsPorCodigo };
}

async function sembrarVentas(
  operadores: UsuarioSesion[],
  idsPorCodigo: Map<string, number>
) {
  const [admin] = operadores;
  const hoy = hoyEnArgentina();
  const clientes = await crearClientes(admin);
  await fecharCargaInicial(hoy);
  const clientesConCuenta = clientes.filter(
    (cliente) => cliente.cuentaCorriente
  );
  const contexto = {
    operadores,
    idsPorCodigo,
    clientes,
    clientesConCuenta,
    hoy,
  };
  const idsFacturas = await registrarVentas(contexto);
  const { indiceDeLaFactura, motivo } = ANULACION_DE_PRUEBA;
  await anularFactura(admin, idsFacturas[indiceDeLaFactura], { motivo });
}

export async function sembrar() {
  const { operadores, idsPorCodigo } = await sembrarCatalogo();
  await sembrarVentas(operadores, idsPorCodigo);
  await verificarInvariantes();
  process.stdout.write(
    `Datos de prueba: ${USUARIOS_DE_PRUEBA.length} usuarios, ${CATEGORIAS_DE_PRUEBA.length} categorías, ${PRODUCTOS_DE_PRUEBA.length} productos, ${CLIENTES_DE_PRUEBA.length} clientes y ${CALENDARIO_DE_PRUEBA.cantidadDeFacturas} facturas.\n`
  );
  process.stdout.write(
    'Invariantes: stock = suma de movimientos y ningún saldo a favor ✔\n'
  );
}

const ejecutadoComoScript = process.argv[1]?.endsWith(NOMBRE_ARCHIVO_SEMILLA);
if (ejecutadoComoScript) {
  await sembrar();
}
