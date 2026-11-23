import {
  and as cumplenTodas,
  asc as ascendente,
  eq as esIgualA,
} from 'drizzle-orm';
import { baseDeDatos } from '@/basedatos/conexion';
import {
  condicionDesdeElDia,
  condicionHastaElDia,
} from '@/basedatos/consultas';
import { movimientosCuenta } from '@/basedatos/esquema';
import { consultarSaldoAntesDelDia } from '@/basedatos/saldos';
import { SALDO_SALDADO, SIGNO_MOVIMIENTO_CUENTA } from '@/constantes/dominio';
import { esquemaFiltroCuenta } from '@/esquemas/clientes';
import { esquemaId } from '@/esquemas/comunes';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { buscarCliente } from '@/servicios/clientes';

type FiltroCuenta = ReturnType<typeof esquemaFiltroCuenta.parse>;

function listarMovimientosDeCuenta(clienteId: number, filtros: FiltroCuenta) {
  return baseDeDatos
    .select({
      fecha: movimientosCuenta.fecha,
      tipo: movimientosCuenta.tipo,
      importe: movimientosCuenta.importe,
      descripcion: movimientosCuenta.descripcion,
      facturaId: movimientosCuenta.facturaId,
      pagoId: movimientosCuenta.pagoId,
    })
    .from(movimientosCuenta)
    .where(
      cumplenTodas(
        esIgualA(movimientosCuenta.clienteId, clienteId),
        condicionDesdeElDia(movimientosCuenta.fecha, filtros.desde),
        condicionHastaElDia(movimientosCuenta.fecha, filtros.hasta)
      )
    )
    .orderBy(
      ascendente(movimientosCuenta.fecha),
      ascendente(movimientosCuenta.id)
    );
}

type MovimientoDeCuenta = Awaited<
  ReturnType<typeof listarMovimientosDeCuenta>
>[number];

function acumularSaldos(
  saldoAnterior: number,
  movimientos: MovimientoDeCuenta[]
) {
  let saldoAcumulado = saldoAnterior;
  const renglones = movimientos.map((movimiento) => {
    saldoAcumulado +=
      movimiento.importe * SIGNO_MOVIMIENTO_CUENTA[movimiento.tipo];
    return { ...movimiento, saldo: saldoAcumulado };
  });
  return { renglones, saldoFinal: saldoAcumulado };
}

function saldoAnteriorAlFiltro(clienteId: number, desde?: string) {
  if (!desde) return SALDO_SALDADO;
  return consultarSaldoAntesDelDia(clienteId, desde);
}

// Cuenta corriente: movimientos en orden cronológico con el saldo acumulado en cada renglón.
export async function consultarCuentaCorriente(
  _usuarioActual: UsuarioSesion,
  idSinValidar: unknown,
  filtrosSinValidar: unknown
) {
  const clienteId = esquemaId.parse(idSinValidar);
  const filtros = esquemaFiltroCuenta.parse(filtrosSinValidar);
  const [{ id, nombre }, saldoAnterior, movimientos] = await Promise.all([
    buscarCliente(clienteId),
    saldoAnteriorAlFiltro(clienteId, filtros.desde),
    listarMovimientosDeCuenta(clienteId, filtros),
  ]);
  const { renglones, saldoFinal } = acumularSaldos(saldoAnterior, movimientos);
  return {
    cliente: { id, nombre },
    saldoAnterior,
    movimientos: renglones,
    saldo: saldoFinal,
  };
}

export type CuentaCorriente = Awaited<
  ReturnType<typeof consultarCuentaCorriente>
>;
