import { eq as esIgualA } from 'drizzle-orm';
import {
  baseDeDatos,
  ejecutarEnTransaccionSerializada,
  type Transaccion,
} from '@/basedatos/conexion';
import {
  clientes,
  movimientosCuenta,
  pagos,
  usuarios,
} from '@/basedatos/esquema';
import {
  consultarSaldo,
  consultarSaldoAlMomentoDelPago,
} from '@/basedatos/saldos';
import {
  MOVIMIENTO_CUENTA,
  NUMERADOR,
  PUNTO_VENTA,
} from '@/constantes/dominio';
import { ERRORES } from '@/constantes/errores';
import { DESCRIPCION_MOVIMIENTO_CUENTA } from '@/constantes/etiquetas';
import { esquemaPago } from '@/esquemas/clientes';
import { esquemaId } from '@/esquemas/comunes';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { formatearRecibo } from '@/lib/formato';
import { buscarCliente } from '@/servicios/clientes';
import { crearError } from '@/servicios/errores';
import { tomarSiguienteNumero } from '@/servicios/numeradores';

type PagoAGrabar = {
  clienteId: number;
  usuarioId: number;
  pago: ReturnType<typeof esquemaPago.parse>;
};

async function exigirPagoQueNoSupereLaDeuda(
  transaccion: Transaccion,
  { clienteId, pago }: PagoAGrabar
) {
  const saldo = await consultarSaldo(transaccion, clienteId);
  if (pago.importe > saldo) {
    throw crearError(ERRORES.PAGO_SUPERA_DEUDA, {
      saldo,
      importe: pago.importe,
    });
  }
}

async function grabarPagoConSuCredito(
  transaccion: Transaccion,
  pagoAGrabar: PagoAGrabar
) {
  const { clienteId, usuarioId, pago } = pagoAGrabar;
  await exigirPagoQueNoSupereLaDeuda(transaccion, pagoAGrabar);
  const numeroRecibo = await tomarSiguienteNumero(
    transaccion,
    NUMERADOR.recibo
  );
  const [pagoGrabado] = await transaccion
    .insert(pagos)
    .values({ ...pago, clienteId, usuarioId, numeroRecibo })
    .returning({ id: pagos.id });
  await transaccion.insert(movimientosCuenta).values({
    clienteId,
    tipo: MOVIMIENTO_CUENTA.credito,
    importe: pago.importe,
    descripcion: DESCRIPCION_MOVIMIENTO_CUENTA.recibo(
      formatearRecibo(PUNTO_VENTA, numeroRecibo)
    ),
    pagoId: pagoGrabado.id,
  });
  return pagoGrabado.id;
}

const seleccionarPagos = () =>
  baseDeDatos
    .select({
      id: pagos.id,
      numero: pagos.numeroRecibo,
      fecha: pagos.fecha,
      cliente: { id: clientes.id, nombre: clientes.nombre },
      importe: pagos.importe,
      medio: pagos.medio,
      observacion: pagos.observacion,
      usuario: { id: usuarios.id, nombre: usuarios.nombre },
    })
    .from(pagos)
    .innerJoin(clientes, esIgualA(clientes.id, pagos.clienteId))
    .innerJoin(usuarios, esIgualA(usuarios.id, pagos.usuarioId));

// Recibo de pago: se puede volver a consultar para reimprimirlo, con el saldo que dejó.
export async function obtenerPago(
  _usuarioActual: UsuarioSesion,
  idSinValidar: unknown
) {
  const pagoId = esquemaId.parse(idSinValidar);
  const [pago] = await seleccionarPagos().where(esIgualA(pagos.id, pagoId));
  if (!pago) throw crearError(ERRORES.NO_ENCONTRADO);
  const { numero, ...recibo } = pago;
  return {
    ...recibo,
    numeroRecibo: formatearRecibo(PUNTO_VENTA, numero),
    saldoCliente: await consultarSaldoAlMomentoDelPago(pago.cliente.id, pagoId),
  };
}

export type Recibo = Awaited<ReturnType<typeof obtenerPago>>;

// Registrar pago: importe que no supera la deuda, medio y observación; genera un recibo numerado.
// El pago y su crédito en la cuenta corriente se graban en una sola transacción.
export async function registrarPago(
  usuarioActual: UsuarioSesion,
  clienteIdSinValidar: unknown,
  pagoSinValidar: unknown
): Promise<Recibo> {
  const clienteId = esquemaId.parse(clienteIdSinValidar);
  const pago = esquemaPago.parse(pagoSinValidar);
  const cliente = await buscarCliente(clienteId);
  if (!cliente.cuentaCorriente) {
    throw crearError(ERRORES.CUENTA_CORRIENTE_NO_HABILITADA);
  }
  const pagoId = await ejecutarEnTransaccionSerializada((transaccion) =>
    grabarPagoConSuCredito(transaccion, {
      clienteId,
      usuarioId: usuarioActual.id,
      pago,
    })
  );
  return obtenerPago(usuarioActual, pagoId);
}
