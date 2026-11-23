import { z as zod } from 'zod';
import {
  ESTADOS_FACTURA,
  FORMA_PAGO,
  FORMAS_PAGO,
  TIPOS_TARJETA,
} from '@/constantes/dominio';
import { MENSAJES_VALIDACION } from '@/constantes/mensajes';
import {
  FORMATO_ULTIMOS_DIGITOS_TARJETA,
  LARGO_MAXIMO,
} from '@/constantes/validacion';
import {
  esquemaId,
  esquemaPaginacion,
  fechaDia,
  textoObligatorio,
} from '@/esquemas/comunes';

const esquemaRenglon = zod.strictObject({
  productoId: esquemaId,
  cantidad: zod
    .number(MENSAJES_VALIDACION.ingresarCantidad)
    .int(MENSAJES_VALIDACION.numeroEntero)
    .positive(MENSAJES_VALIDACION.mayorQueCero),
});

type RenglonPedido = zod.infer<typeof esquemaRenglon>;

function sinProductosRepetidos(renglones: RenglonPedido[]) {
  const productos = renglones.map(({ productoId }) => productoId);
  return new Set(productos).size === productos.length;
}

const esquemaTarjeta = zod.strictObject({
  tipo: zod.enum(TIPOS_TARJETA, MENSAJES_VALIDACION.elegirTipoTarjeta),
  marca: textoObligatorio(LARGO_MAXIMO.marcaTarjeta),
  ultimos4: zod
    .string()
    .trim()
    .regex(
      FORMATO_ULTIMOS_DIGITOS_TARJETA,
      MENSAJES_VALIDACION.ultimosDigitosTarjeta
    ),
});

export const esquemaPagoDeVenta = zod.discriminatedUnion(
  'forma',
  [
    zod.strictObject({
      forma: zod.literal(FORMA_PAGO.contado),
      montoRecibido: zod
        .number(MENSAJES_VALIDACION.ingresarImporte)
        .int(MENSAJES_VALIDACION.importeEnCentavos)
        .nonnegative(MENSAJES_VALIDACION.noNegativo)
        .optional(),
    }),
    zod.strictObject({
      forma: zod.literal(FORMA_PAGO.tarjeta),
      tarjeta: esquemaTarjeta,
    }),
    zod.strictObject({ forma: zod.literal(FORMA_PAGO.cuentaCorriente) }),
  ],
  MENSAJES_VALIDACION.elegirFormaPago
);

export const esquemaVenta = zod.strictObject({
  clienteId: esquemaId.nullable().default(null),
  items: zod
    .array(esquemaRenglon)
    .min(1, MENSAJES_VALIDACION.ventaSinItems)
    .refine(sinProductosRepetidos, MENSAJES_VALIDACION.productoRepetido),
  pago: esquemaPagoDeVenta,
});

export const esquemaAnulacion = zod.strictObject({
  motivo: textoObligatorio(LARGO_MAXIMO.motivoAnulacion),
});

export const esquemaFiltroFacturas = esquemaPaginacion.extend({
  q: zod.string().trim().optional(),
  desde: fechaDia.optional(),
  hasta: fechaDia.optional(),
  clienteId: zod.coerce.number().int().positive().optional(),
  vendedorId: zod.coerce.number().int().positive().optional(),
  forma: zod.enum(FORMAS_PAGO).optional(),
  estado: zod.enum(ESTADOS_FACTURA).optional(),
});

export type DatosVenta = zod.input<typeof esquemaVenta>;
export type Venta = zod.output<typeof esquemaVenta>;
export type PagoDeVenta = Venta['pago'];
export type FiltroFacturas = zod.output<typeof esquemaFiltroFacturas>;

const camposComunesDelFormulario = {
  clienteId: esquemaId.nullable(),
  items: esquemaVenta.shape.items,
};

export const esquemaFormularioVenta = zod.discriminatedUnion('forma', [
  zod.object({
    ...camposComunesDelFormulario,
    forma: zod.literal(FORMA_PAGO.contado),
    montoRecibido: zod
      .nan()
      .or(
        zod
          .number()
          .int(MENSAJES_VALIDACION.importeEnCentavos)
          .nonnegative(MENSAJES_VALIDACION.noNegativo)
      ),
  }),
  zod.object({
    ...camposComunesDelFormulario,
    forma: zod.literal(FORMA_PAGO.tarjeta),
    tarjetaTipo: esquemaTarjeta.shape.tipo,
    tarjetaMarca: esquemaTarjeta.shape.marca,
    tarjetaUltimos4: esquemaTarjeta.shape.ultimos4,
  }),
  zod.object({
    ...camposComunesDelFormulario,
    forma: zod.literal(FORMA_PAGO.cuentaCorriente),
  }),
]);
