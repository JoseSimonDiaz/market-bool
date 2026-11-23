import { inArray as estaEntre } from 'drizzle-orm';
import {
  ejecutarEnTransaccionSerializada,
  type Transaccion,
} from '@/basedatos/conexion';
import {
  facturaItems,
  facturas,
  movimientosCuenta,
  productos,
} from '@/basedatos/esquema';
import { consultarSaldo } from '@/basedatos/saldos';
import {
  FORMA_PAGO,
  IMPORTE_CERO,
  MOTIVO_VENTA,
  MOVIMIENTO_CUENTA,
  MOVIMIENTO_STOCK,
  NUMERADOR,
  PUNTO_VENTA,
} from '@/constantes/dominio';
import { ERRORES } from '@/constantes/errores';
import { DESCRIPCION_MOVIMIENTO_CUENTA } from '@/constantes/etiquetas';
import { MENSAJES_VALIDACION } from '@/constantes/mensajes';
import {
  esquemaVenta,
  type PagoDeVenta,
  type Venta,
} from '@/esquemas/facturas';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { formatearNumeroComprobante } from '@/lib/formato';
import { tieneValor } from '@/lib/valores';
import { calcularSubtotal, calcularTotal } from '@/lib/ventas';
import { buscarCliente, type Cliente } from '@/servicios/clientes';
import { crearError } from '@/servicios/errores';
import { obtenerFactura, type Factura } from '@/servicios/facturas';
import { tomarSiguienteNumero } from '@/servicios/numeradores';
import { moverStock } from '@/servicios/stock';

type RenglonPedido = Venta['items'][number];

type ProductoVendible = {
  id: number;
  codigo: string;
  descripcion: string;
  precio: number;
  existencia: number;
  activo: boolean;
};

type RenglonDeVenta = {
  productoId: number;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  existencia: number;
};

type VentaAConfirmar = {
  venta: Venta;
  cliente: Cliente | null;
  usuarioId: number;
};

type FacturaGrabada = { id: number; numero: number; total: number };

async function leerProductosPedidos(
  transaccion: Transaccion,
  renglones: RenglonPedido[]
) {
  const productosLeidos = await transaccion
    .select({
      id: productos.id,
      codigo: productos.codigo,
      descripcion: productos.descripcion,
      precio: productos.precio,
      existencia: productos.existencia,
      activo: productos.activo,
    })
    .from(productos)
    .where(
      estaEntre(
        productos.id,
        renglones.map(({ productoId }) => productoId)
      )
    );
  return new Map(productosLeidos.map((producto) => [producto.id, producto]));
}

function valorizarRenglon(
  { productoId, cantidad }: RenglonPedido,
  productosPorId: Map<number, ProductoVendible>
): RenglonDeVenta {
  const producto = productosPorId.get(productoId);
  if (!producto) throw crearError(ERRORES.NO_ENCONTRADO, { productoId });
  if (!producto.activo) {
    throw crearError(ERRORES.PRODUCTO_INACTIVO, { productoId });
  }
  const { codigo, descripcion, precio, existencia } = producto;
  return {
    productoId,
    codigo,
    descripcion,
    cantidad,
    precioUnitario: precio,
    existencia,
  };
}

function exigirExistenciaSuficiente(renglones: RenglonDeVenta[]) {
  const faltantes = renglones
    .filter(({ cantidad, existencia }) => cantidad > existencia)
    .map(({ productoId, cantidad, existencia }) => ({
      productoId,
      solicitado: cantidad,
      disponible: existencia,
    }));
  if (faltantes.length > 0) {
    throw crearError(ERRORES.STOCK_INSUFICIENTE, faltantes);
  }
}

function exigirMontoQueCubraElTotal(montoRecibido: number, total: number) {
  if (montoRecibido < total) {
    throw crearError(ERRORES.MONTO_INSUFICIENTE, { total, montoRecibido });
  }
}

async function exigirCreditoDisponible(
  transaccion: Transaccion,
  cliente: Cliente | null,
  total: number
) {
  if (!cliente?.cuentaCorriente) {
    throw crearError(ERRORES.CUENTA_CORRIENTE_NO_HABILITADA);
  }
  if (!tieneValor(cliente.limiteCredito)) return;
  const saldoActual = await consultarSaldo(transaccion, cliente.id);
  const excedente = saldoActual + total - cliente.limiteCredito;
  if (excedente > IMPORTE_CERO) {
    throw crearError(ERRORES.LIMITE_CREDITO_EXCEDIDO, {
      saldoActual,
      limite: cliente.limiteCredito,
      excedente,
    });
  }
}

async function exigirPagoValido(
  transaccion: Transaccion,
  { venta, cliente }: VentaAConfirmar,
  total: number
) {
  const { pago } = venta;
  if (pago.forma === FORMA_PAGO.contado) {
    return exigirMontoQueCubraElTotal(pago.montoRecibido ?? total, total);
  }
  if (pago.forma === FORMA_PAGO.cuentaCorriente) {
    return exigirCreditoDisponible(transaccion, cliente, total);
  }
}

function columnasDelPago(pago: PagoDeVenta, total: number) {
  if (pago.forma === FORMA_PAGO.contado) {
    return {
      formaPago: pago.forma,
      montoRecibido: pago.montoRecibido ?? total,
    };
  }
  if (pago.forma === FORMA_PAGO.tarjeta) {
    return {
      formaPago: pago.forma,
      tarjetaTipo: pago.tarjeta.tipo,
      tarjetaMarca: pago.tarjeta.marca,
      tarjetaUltimos4: pago.tarjeta.ultimos4,
    };
  }
  return { formaPago: pago.forma };
}

async function grabarFactura(
  transaccion: Transaccion,
  { venta, usuarioId }: VentaAConfirmar,
  renglones: RenglonDeVenta[]
): Promise<FacturaGrabada> {
  const total = calcularTotal(renglones);
  const numero = await tomarSiguienteNumero(transaccion, NUMERADOR.factura);
  const [factura] = await transaccion
    .insert(facturas)
    .values({
      puntoVenta: PUNTO_VENTA,
      numero,
      clienteId: venta.clienteId,
      usuarioId,
      total,
      ...columnasDelPago(venta.pago, total),
    })
    .returning({ id: facturas.id });
  await transaccion.insert(facturaItems).values(
    renglones.map(({ existencia: _leidaParaControlar, ...renglon }) => ({
      ...renglon,
      facturaId: factura.id,
      subtotal: calcularSubtotal(renglon),
    }))
  );
  return { id: factura.id, numero, total };
}

async function descontarExistencias(
  transaccion: Transaccion,
  renglones: RenglonDeVenta[],
  { facturaId, usuarioId }: { facturaId: number; usuarioId: number }
) {
  for (const { productoId, cantidad } of renglones) {
    await moverStock(transaccion, {
      productoId,
      cantidadConSigno: -cantidad,
      tipo: MOVIMIENTO_STOCK.venta,
      motivo: MOTIVO_VENTA,
      usuarioId,
      facturaId,
    });
  }
}

async function debitarCuentaCorriente(
  transaccion: Transaccion,
  { venta, cliente }: VentaAConfirmar,
  factura: FacturaGrabada
) {
  if (venta.pago.forma !== FORMA_PAGO.cuentaCorriente || !cliente) return;
  await transaccion.insert(movimientosCuenta).values({
    clienteId: cliente.id,
    tipo: MOVIMIENTO_CUENTA.debito,
    importe: factura.total,
    descripcion: DESCRIPCION_MOVIMIENTO_CUENTA.factura(
      formatearNumeroComprobante(PUNTO_VENTA, factura.numero)
    ),
    facturaId: factura.id,
  });
}

async function confirmarVenta(
  transaccion: Transaccion,
  ventaAConfirmar: VentaAConfirmar
) {
  const { venta, usuarioId } = ventaAConfirmar;
  const productosPorId = await leerProductosPedidos(transaccion, venta.items);
  const renglones = venta.items.map((renglon) =>
    valorizarRenglon(renglon, productosPorId)
  );
  exigirExistenciaSuficiente(renglones);
  await exigirPagoValido(
    transaccion,
    ventaAConfirmar,
    calcularTotal(renglones)
  );
  const factura = await grabarFactura(transaccion, ventaAConfirmar, renglones);
  await descontarExistencias(transaccion, renglones, {
    facturaId: factura.id,
    usuarioId,
  });
  await debitarCuentaCorriente(transaccion, ventaAConfirmar, factura);
  return factura.id;
}

async function compradorDeLaVenta(clienteId: number | null) {
  if (!clienteId) return null;
  const cliente = await buscarCliente(clienteId);
  if (!cliente.activo) {
    throw crearError(ERRORES.VALIDACION, [
      {
        campo: esquemaVenta.keyof().enum.clienteId,
        mensaje: MENSAJES_VALIDACION.clienteDadoDeBaja,
      },
    ]);
  }
  return cliente;
}

// Confirmación de la venta: vuelve a verificar el stock, asigna el número, descuenta existencias
// y registra el débito en cuenta corriente, todo en una única transacción.
// El precio se congela: la factura copia descripción y precio del catálogo.
// Consumidor final no compra en cuenta corriente, y una venta a cuenta respeta el límite de crédito.
export async function emitirFactura(
  usuarioActual: UsuarioSesion,
  ventaSinValidar: unknown
): Promise<Factura> {
  const venta = esquemaVenta.parse(ventaSinValidar);
  const cliente = await compradorDeLaVenta(venta.clienteId);
  const facturaId = await ejecutarEnTransaccionSerializada((transaccion) =>
    confirmarVenta(transaccion, { venta, cliente, usuarioId: usuarioActual.id })
  );
  return obtenerFactura(usuarioActual, facturaId);
}
