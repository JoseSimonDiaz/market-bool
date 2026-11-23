import { FORMA_PAGO, IMPORTE_CERO } from '@/constantes/dominio';
import {
  ETIQUETA_FORMA_PAGO,
  ETIQUETA_TIPO_TARJETA,
} from '@/constantes/etiquetas';
import { SEPARADOR_DATOS, SIN_REFERENCIA } from '@/constantes/interfaz';
import { formatearMoneda } from '@/lib/formato';
import type { Factura } from '@/servicios/facturas';

function detallesDelPago({ pago, saldoCliente }: Factura) {
  if (pago.forma === FORMA_PAGO.contado) {
    return [
      `Recibido ${formatearMoneda(pago.montoRecibido)}`,
      `Vuelto ${formatearMoneda(pago.vuelto)}`,
    ];
  }
  if (pago.forma === FORMA_PAGO.tarjeta) {
    const { tipo, marca, ultimos4 } = pago.tarjeta;
    const tipoDeTarjeta = tipo ? ETIQUETA_TIPO_TARJETA[tipo] : SIN_REFERENCIA;
    return [
      `${tipoDeTarjeta} ${marca ?? SIN_REFERENCIA}`,
      `terminada en ${ultimos4}`,
    ];
  }
  return [`Saldo del cliente ${formatearMoneda(saldoCliente ?? IMPORTE_CERO)}`];
}

export function DescripcionDelPago({ factura }: { factura: Factura }) {
  const descripcion = [
    ETIQUETA_FORMA_PAGO[factura.pago.forma],
    ...detallesDelPago(factura),
  ].join(SEPARADOR_DATOS);
  return <>{descripcion}</>;
}
