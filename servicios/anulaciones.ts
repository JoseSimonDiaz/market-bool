import { and as cumplenTodas, eq as esIgualA } from 'drizzle-orm';
import {
  ejecutarEnTransaccionSerializada,
  type Transaccion,
} from '@/basedatos/conexion';
import { facturaItems, facturas, movimientosCuenta } from '@/basedatos/esquema';
import {
  ESTADO_FACTURA,
  FORMA_PAGO,
  MOTIVO_ANULACION,
  MOVIMIENTO_CUENTA,
  MOVIMIENTO_STOCK,
} from '@/constantes/dominio';
import { ERRORES } from '@/constantes/errores';
import { DESCRIPCION_MOVIMIENTO_CUENTA } from '@/constantes/etiquetas';
import { esquemaId } from '@/esquemas/comunes';
import { esquemaAnulacion } from '@/esquemas/facturas';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { ahoraIso } from '@/lib/fechas';
import { formatearNumeroComprobante } from '@/lib/formato';
import { crearError } from '@/servicios/errores';
import { obtenerFactura, type Factura } from '@/servicios/facturas';
import { exigirAdmin } from '@/servicios/permisos';
import { moverStock } from '@/servicios/stock';

type PedidoDeAnulacion = {
  facturaId: number;
  motivo: string;
  usuarioId: number;
};

async function marcarComoAnulada(
  transaccion: Transaccion,
  { facturaId, motivo, usuarioId }: PedidoDeAnulacion
) {
  const [anulada] = await transaccion
    .update(facturas)
    .set({
      estado: ESTADO_FACTURA.anulada,
      motivoAnulacion: motivo,
      anuladaEn: ahoraIso(),
      anuladaPorId: usuarioId,
    })
    .where(
      cumplenTodas(
        esIgualA(facturas.id, facturaId),
        esIgualA(facturas.estado, ESTADO_FACTURA.emitida)
      )
    )
    .returning({
      id: facturas.id,
      puntoVenta: facturas.puntoVenta,
      numero: facturas.numero,
      total: facturas.total,
      clienteId: facturas.clienteId,
      formaPago: facturas.formaPago,
    });
  return anulada;
}

type FacturaAnulada = NonNullable<
  Awaited<ReturnType<typeof marcarComoAnulada>>
>;

async function informarFacturaNoAnulable(
  transaccion: Transaccion,
  facturaId: number
): Promise<never> {
  const [existente] = await transaccion
    .select({ id: facturas.id })
    .from(facturas)
    .where(esIgualA(facturas.id, facturaId));
  if (!existente) throw crearError(ERRORES.NO_ENCONTRADO);
  throw crearError(ERRORES.FACTURA_ANULADA);
}

async function reingresarExistencias(
  transaccion: Transaccion,
  factura: FacturaAnulada,
  { motivo, usuarioId }: PedidoDeAnulacion
) {
  const renglones = await transaccion
    .select({
      productoId: facturaItems.productoId,
      cantidad: facturaItems.cantidad,
    })
    .from(facturaItems)
    .where(esIgualA(facturaItems.facturaId, factura.id));
  for (const { productoId, cantidad } of renglones) {
    await moverStock(transaccion, {
      productoId,
      cantidadConSigno: cantidad,
      tipo: MOVIMIENTO_STOCK.anulacion,
      motivo: MOTIVO_ANULACION,
      observacion: motivo,
      usuarioId,
      facturaId: factura.id,
    });
  }
}

async function acreditarCuentaCorriente(
  transaccion: Transaccion,
  factura: FacturaAnulada
) {
  const fueACuenta = factura.formaPago === FORMA_PAGO.cuentaCorriente;
  if (!fueACuenta || !factura.clienteId) return;
  await transaccion.insert(movimientosCuenta).values({
    clienteId: factura.clienteId,
    tipo: MOVIMIENTO_CUENTA.credito,
    importe: factura.total,
    descripcion: DESCRIPCION_MOVIMIENTO_CUENTA.anulacion(
      formatearNumeroComprobante(factura.puntoVenta, factura.numero)
    ),
    facturaId: factura.id,
  });
}

async function revertirFactura(
  transaccion: Transaccion,
  pedido: PedidoDeAnulacion
) {
  const anulada = await marcarComoAnulada(transaccion, pedido);
  if (!anulada) return informarFacturaNoAnulable(transaccion, pedido.facturaId);
  await reingresarExistencias(transaccion, anulada, pedido);
  await acreditarCuentaCorriente(transaccion, anulada);
}

// Anulación: solo el administrador y con motivo; reingresa el stock y, si fue a cuenta corriente, acredita el total.
// Una factura confirmada no se modifica ni se borra: queda visible como anulada.
export async function anularFactura(
  usuarioActual: UsuarioSesion,
  idSinValidar: unknown,
  anulacionSinValidar: unknown
): Promise<Factura> {
  const facturaId = esquemaId.parse(idSinValidar);
  const { motivo } = esquemaAnulacion.parse(anulacionSinValidar);
  exigirAdmin(usuarioActual);
  await ejecutarEnTransaccionSerializada((transaccion) =>
    revertirFactura(transaccion, {
      facturaId,
      motivo,
      usuarioId: usuarioActual.id,
    })
  );
  return obtenerFactura(usuarioActual, facturaId);
}
