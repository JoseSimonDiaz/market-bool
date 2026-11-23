import {
  and as cumplenTodas,
  eq as esIgualA,
  lt as esMenorQue,
  lte as esMenorOIgualA,
  sql as expresionSql,
  sum as sumar,
  type SQL,
} from 'drizzle-orm';
import { baseDeDatos, type Ejecutor } from '@/basedatos/conexion';
import { clientes, movimientosCuenta } from '@/basedatos/esquema';
import { ALIAS_SQL } from '@/constantes/basedatos';
import { MOVIMIENTO_CUENTA, SALDO_SALDADO } from '@/constantes/dominio';
import { inicioDiaArgentina } from '@/lib/fechas';

const importeConSigno = expresionSql<number>`case when ${movimientosCuenta.tipo} = ${MOVIMIENTO_CUENTA.debito} then ${movimientosCuenta.importe} else -${movimientosCuenta.importe} end`;

export const saldosPorCliente = baseDeDatos
  .select({
    clienteId: movimientosCuenta.clienteId,
    saldo: sumar(importeConSigno).as(ALIAS_SQL.saldo),
  })
  .from(movimientosCuenta)
  .groupBy(movimientosCuenta.clienteId)
  .as(ALIAS_SQL.saldosPorCliente);

export const saldoDelCliente =
  expresionSql<number>`coalesce(${saldosPorCliente.saldo}, ${SALDO_SALDADO})`.mapWith(
    Number
  );

export const uneSaldoConCliente = esIgualA(
  saldosPorCliente.clienteId,
  clientes.id
);

async function sumarMovimientos(
  ejecutor: Ejecutor,
  condiciones: SQL | undefined
) {
  const [{ saldo }] = await ejecutor
    .select({
      saldo:
        expresionSql<number>`coalesce(${sumar(importeConSigno)}, ${SALDO_SALDADO})`.mapWith(
          Number
        ),
    })
    .from(movimientosCuenta)
    .where(condiciones);
  return saldo;
}

const esDelCliente = (clienteId: number) =>
  esIgualA(movimientosCuenta.clienteId, clienteId);

export function consultarSaldo(ejecutor: Ejecutor, clienteId: number) {
  return sumarMovimientos(ejecutor, esDelCliente(clienteId));
}

export function consultarSaldoAntesDelDia(clienteId: number, dia: string) {
  return sumarMovimientos(
    baseDeDatos,
    cumplenTodas(
      esDelCliente(clienteId),
      esMenorQue(movimientosCuenta.fecha, inicioDiaArgentina(dia))
    )
  );
}

export function consultarSaldoAlMomentoDelPago(
  clienteId: number,
  pagoId: number
) {
  const movimientoDelPago = baseDeDatos
    .select({ id: movimientosCuenta.id })
    .from(movimientosCuenta)
    .where(esIgualA(movimientosCuenta.pagoId, pagoId));
  return sumarMovimientos(
    baseDeDatos,
    cumplenTodas(
      esDelCliente(clienteId),
      esMenorOIgualA(movimientosCuenta.id, expresionSql`(${movimientoDelPago})`)
    )
  );
}
