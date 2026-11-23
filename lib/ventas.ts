import { FORMA_PAGO, IMPORTE_CERO } from '@/constantes/dominio';
import type {
  CamposVenta,
  RenglonDelFormulario,
} from '@/constantes/formularios';
import { CANTIDAD_INICIAL_RENGLON } from '@/constantes/interfaz';
import type { DatosVenta } from '@/esquemas/facturas';

export type RenglonValorizado = { cantidad: number; precioUnitario: number };

export function calcularSubtotal({
  cantidad,
  precioUnitario,
}: RenglonValorizado) {
  return cantidad * precioUnitario;
}

export function calcularTotal(renglones: RenglonValorizado[]) {
  return renglones.reduce(
    (acumulado, renglon) => acumulado + calcularSubtotal(renglon),
    IMPORTE_CERO
  );
}

export function calcularVuelto(montoRecibido: number, total: number) {
  return Math.max(montoRecibido - total, IMPORTE_CERO);
}

function pagoDelFormulario(campos: CamposVenta): DatosVenta['pago'] {
  if (campos.forma === FORMA_PAGO.contado) {
    const montoIngresado = Number.isFinite(campos.montoRecibido);
    const montoRecibido = montoIngresado ? campos.montoRecibido : undefined;
    return { forma: campos.forma, montoRecibido };
  }
  if (campos.forma === FORMA_PAGO.tarjeta) {
    const tarjeta = {
      tipo: campos.tarjetaTipo,
      marca: campos.tarjetaMarca,
      ultimos4: campos.tarjetaUltimos4,
    };
    return { forma: campos.forma, tarjeta };
  }
  return { forma: campos.forma };
}

export function armarPedidoDeVenta(campos: CamposVenta): DatosVenta {
  return {
    clienteId: campos.clienteId,
    items: campos.items,
    pago: pagoDelFormulario(campos),
  };
}

type CambioDeCantidad = {
  productoId: number;
  cantidad: number;
  existencia: number;
};

export function cambiarCantidadDelRenglon(
  renglones: RenglonDelFormulario[],
  { productoId, cantidad, existencia }: CambioDeCantidad
) {
  const cantidadPermitida = Math.min(cantidad, existencia);
  return renglones.map((renglon) =>
    renglon.productoId === productoId
      ? { ...renglon, cantidad: cantidadPermitida }
      : renglon
  );
}

export function agregarAlPedido(
  renglones: RenglonDelFormulario[],
  { productoId, existencia }: Omit<CambioDeCantidad, 'cantidad'>
) {
  const existente = renglones.find(
    (renglon) => renglon.productoId === productoId
  );
  if (!existente) {
    return [...renglones, { productoId, cantidad: CANTIDAD_INICIAL_RENGLON }];
  }
  return cambiarCantidadDelRenglon(renglones, {
    productoId,
    cantidad: existente.cantidad + CANTIDAD_INICIAL_RENGLON,
    existencia,
  });
}

export function quitarDelPedido(
  renglones: RenglonDelFormulario[],
  productoId: number
) {
  return renglones.filter((renglon) => renglon.productoId !== productoId);
}

type ProductoConPrecio = { precio: number };

export function valorizarRenglones(
  renglones: RenglonDelFormulario[],
  productosPorId: ReadonlyMap<number, ProductoConPrecio>
): RenglonValorizado[] {
  return renglones.map(({ productoId, cantidad }) => ({
    cantidad,
    precioUnitario: productosPorId.get(productoId)?.precio ?? IMPORTE_CERO,
  }));
}
