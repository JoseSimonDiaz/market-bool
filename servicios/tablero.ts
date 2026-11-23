import {
  and as cumplenTodas,
  asc as ascendente,
  count as contarFilas,
  desc as descendente,
  eq as esIgualA,
  gt as esMayorQue,
  sql as expresionSql,
} from 'drizzle-orm';
import { baseDeDatos } from '@/basedatos/conexion';
import {
  condicionDesdeElDia,
  condicionHastaElDia,
} from '@/basedatos/consultas';
import { facturaItems, facturas, productos } from '@/basedatos/esquema';
import { saldosPorCliente } from '@/basedatos/saldos';
import {
  CANTIDAD_MAS_VENDIDOS,
  DIAS_VENTAS_DIARIAS,
  ESTADO_FACTURA,
  FORMAS_PAGO,
  IMPORTE_CERO,
  SALDO_SALDADO,
  SIN_FACTURAS,
} from '@/constantes/dominio';
import { MODIFICADOR_HORARIO_ARGENTINA, UN_DIA } from '@/constantes/formato';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import {
  diasConsecutivos,
  hoyEnArgentina,
  primerDiaDelMes,
  sumarDias,
} from '@/lib/fechas';
import { contarProductosBajoMinimo } from '@/servicios/productos';

type Periodo = { desde: string; hasta: string };

const importeVendido =
  expresionSql<number>`coalesce(sum(${facturas.total}), ${IMPORTE_CERO})`.mapWith(
    Number
  );
const diaDeLaFactura = expresionSql<string>`date(${facturas.fecha}, ${MODIFICADOR_HORARIO_ARGENTINA})`;
const unidadesVendidas =
  expresionSql<number>`sum(${facturaItems.cantidad})`.mapWith(Number);
const importeDeLosRenglones =
  expresionSql<number>`sum(${facturaItems.subtotal})`.mapWith(Number);
const saldoAdeudado = expresionSql<number>`${saldosPorCliente.saldo}`;

function emitidasEnElPeriodo({ desde, hasta }: Periodo) {
  return cumplenTodas(
    esIgualA(facturas.estado, ESTADO_FACTURA.emitida),
    condicionDesdeElDia(facturas.fecha, desde),
    condicionHastaElDia(facturas.fecha, hasta)
  );
}

async function resumirVentas(periodo: Periodo) {
  const [resumen] = await baseDeDatos
    .select({ cantidad: contarFilas(), importe: importeVendido })
    .from(facturas)
    .where(emitidasEnElPeriodo(periodo));
  return resumen;
}

async function resumirVentasConTicketPromedio(periodo: Periodo) {
  const resumen = await resumirVentas(periodo);
  const ticketPromedio =
    resumen.cantidad === SIN_FACTURAS
      ? IMPORTE_CERO
      : Math.round(resumen.importe / resumen.cantidad);
  return { ...resumen, ticketPromedio };
}

async function resumirCuentasCorrientes() {
  const [resumen] = await baseDeDatos
    .select({
      totalAdeudado:
        expresionSql<number>`coalesce(sum(${saldoAdeudado}), ${SALDO_SALDADO})`.mapWith(
          Number
        ),
      clientesConSaldo: contarFilas(),
    })
    .from(saldosPorCliente)
    .where(esMayorQue(saldoAdeudado, SALDO_SALDADO));
  return resumen;
}

async function listarVentasDiarias(periodo: Periodo) {
  const filas = await baseDeDatos
    .select({ fecha: diaDeLaFactura, importe: importeVendido })
    .from(facturas)
    .where(emitidasEnElPeriodo(periodo))
    .groupBy(diaDeLaFactura)
    .orderBy(ascendente(diaDeLaFactura));
  const importePorDia = new Map(
    filas.map(({ fecha, importe }) => [fecha, importe])
  );
  return diasConsecutivos(periodo.desde, DIAS_VENTAS_DIARIAS).map((fecha) => ({
    fecha,
    importe: importePorDia.get(fecha) ?? IMPORTE_CERO,
  }));
}

async function listarVentasPorFormaDePago(periodo: Periodo) {
  const filas = await baseDeDatos
    .select({ forma: facturas.formaPago, importe: importeVendido })
    .from(facturas)
    .where(emitidasEnElPeriodo(periodo))
    .groupBy(facturas.formaPago)
    .orderBy(ascendente(facturas.formaPago));
  const importePorForma = new Map(
    filas.map(({ forma, importe }) => [forma, importe])
  );
  return FORMAS_PAGO.map((forma) => ({
    forma,
    importe: importePorForma.get(forma) ?? IMPORTE_CERO,
  }));
}

function listarMasVendidos(periodo: Periodo) {
  return baseDeDatos
    .select({
      productoId: facturaItems.productoId,
      codigo: productos.codigo,
      descripcion: productos.descripcion,
      unidades: unidadesVendidas,
      importe: importeDeLosRenglones,
    })
    .from(facturaItems)
    .innerJoin(facturas, esIgualA(facturas.id, facturaItems.facturaId))
    .innerJoin(productos, esIgualA(productos.id, facturaItems.productoId))
    .where(emitidasEnElPeriodo(periodo))
    .groupBy(facturaItems.productoId)
    .orderBy(descendente(unidadesVendidas), ascendente(productos.codigo))
    .limit(CANTIDAD_MAS_VENDIDOS);
}

function periodosDelTablero() {
  const hoy = hoyEnArgentina();
  return {
    delDia: { desde: hoy, hasta: hoy },
    delMes: { desde: primerDiaDelMes(hoy), hasta: hoy },
    ultimosDias: {
      desde: sumarDias(hoy, UN_DIA - DIAS_VENTAS_DIARIAS),
      hasta: hoy,
    },
  };
}

type PeriodosDelTablero = ReturnType<typeof periodosDelTablero>;

async function consultarIndicadores({ delDia, delMes }: PeriodosDelTablero) {
  const [hoy, mes, cuentasCorrientes, cantidadBajoMinimo] = await Promise.all([
    resumirVentas(delDia),
    resumirVentasConTicketPromedio(delMes),
    resumirCuentasCorrientes(),
    contarProductosBajoMinimo(),
  ]);
  return {
    hoy,
    mes,
    cuentasCorrientes,
    bajoMinimo: { cantidad: cantidadBajoMinimo },
  };
}

async function consultarGraficos({ delMes, ultimosDias }: PeriodosDelTablero) {
  const [ventasDiarias, porFormaDePago, masVendidos] = await Promise.all([
    listarVentasDiarias(ultimosDias),
    listarVentasPorFormaDePago(delMes),
    listarMasVendidos(delMes),
  ]);
  return { ventasDiarias, porFormaDePago, masVendidos };
}

// Indicadores: ventas del día y del mes, total adeudado en cuentas corrientes y productos bajo el mínimo.
// Gráficos: ventas diarias de los últimos 30 días y ventas del mes por forma de pago.
// Más vendidos: los 5 productos más vendidos del mes, por cantidad.
// Solo cuentan las facturas emitidas, y el día y el mes son los de Argentina.
export async function obtenerTablero(_usuarioActual: UsuarioSesion) {
  const periodos = periodosDelTablero();
  const [indicadores, graficos] = await Promise.all([
    consultarIndicadores(periodos),
    consultarGraficos(periodos),
  ]);
  return { ...indicadores, ...graficos };
}

export type Tablero = Awaited<ReturnType<typeof obtenerTablero>>;
