import { z as zod } from 'zod';
import { MENSAJES_VALIDACION } from '@/constantes/mensajes';
import { FORMATO_CODIGO_PRODUCTO, LARGO_MAXIMO } from '@/constantes/validacion';
import {
  ESTADO_FILTRO,
  MOTIVOS_EGRESO,
  MOTIVOS_INGRESO,
  MOVIMIENTO_STOCK,
  TIPOS_MOVIMIENTO_STOCK,
} from '@/constantes/dominio';
import {
  booleanoDeUrl,
  esquemaPaginacion,
  estadoFiltroConDefecto,
  fechaDia,
  textoObligatorio,
  textoOpcional,
} from '@/esquemas/comunes';

const nombreCategoria = textoObligatorio(LARGO_MAXIMO.nombreCategoria);

export const esquemaAltaCategoria = zod.strictObject({
  nombre: nombreCategoria,
});

export const esquemaEdicionCategoria = zod.strictObject({
  nombre: nombreCategoria.optional(),
  activa: zod.boolean().optional(),
});

export const esquemaFiltroCategorias = zod.object({
  incluirInactivas: booleanoDeUrl.default(false),
});

const codigo = zod
  .string()
  .trim()
  .toUpperCase()
  .min(1, MENSAJES_VALIDACION.obligatorio)
  .max(
    LARGO_MAXIMO.codigoProducto,
    MENSAJES_VALIDACION.maximoCaracteres(LARGO_MAXIMO.codigoProducto)
  )
  .regex(FORMATO_CODIGO_PRODUCTO, MENSAJES_VALIDACION.formatoCodigo);

const descripcion = textoObligatorio(LARGO_MAXIMO.descripcionProducto);

const precioEnCentavos = zod
  .number({ error: MENSAJES_VALIDACION.ingresarPrecio })
  .int(MENSAJES_VALIDACION.precioEnCentavos)
  .positive(MENSAJES_VALIDACION.mayorQueCero);

const cantidadNoNegativa = zod
  .number({ error: MENSAJES_VALIDACION.ingresarNumero })
  .int(MENSAJES_VALIDACION.numeroEntero)
  .min(0, MENSAJES_VALIDACION.noNegativo);

const categoriaId = zod
  .number({ error: MENSAJES_VALIDACION.elegirCategoria })
  .int()
  .positive(MENSAJES_VALIDACION.elegirCategoria);

export const esquemaAltaProducto = zod.strictObject({
  codigo,
  descripcion,
  categoriaId,
  precio: precioEnCentavos,
  stockMinimo: cantidadNoNegativa,
  stockInicial: cantidadNoNegativa.optional(),
});

export const esquemaEdicionProducto = zod.strictObject({
  codigo: codigo.optional(),
  descripcion: descripcion.optional(),
  categoriaId: categoriaId.optional(),
  precio: precioEnCentavos.optional(),
  stockMinimo: cantidadNoNegativa.optional(),
  activo: zod.boolean().optional(),
});

export const esquemaFiltroProductos = esquemaPaginacion.extend({
  q: zod.string().trim().optional(),
  categoriaId: zod.coerce.number().int().positive().optional(),
  bajoMinimo: booleanoDeUrl.default(false),
  estado: estadoFiltroConDefecto(ESTADO_FILTRO.activos),
});

const cantidadMovida = zod
  .number({ error: MENSAJES_VALIDACION.ingresarCantidad })
  .int(MENSAJES_VALIDACION.numeroEntero)
  .positive(MENSAJES_VALIDACION.mayorQueCero);

const observacion = textoOpcional(LARGO_MAXIMO.observacion);

export const esquemaMovimientoManual = zod.discriminatedUnion('tipo', [
  zod.strictObject({
    tipo: zod.literal(MOVIMIENTO_STOCK.ingreso),
    cantidad: cantidadMovida,
    motivo: zod.enum(MOTIVOS_INGRESO, MENSAJES_VALIDACION.elegirMotivo),
    observacion,
  }),
  zod.strictObject({
    tipo: zod.literal(MOVIMIENTO_STOCK.egreso),
    cantidad: cantidadMovida,
    motivo: zod.enum(MOTIVOS_EGRESO, MENSAJES_VALIDACION.elegirMotivo),
    observacion,
  }),
]);

export const esquemaFiltroMovimientos = esquemaPaginacion.extend({
  productoId: zod.coerce.number().int().positive().optional(),
  tipo: zod.enum(TIPOS_MOVIMIENTO_STOCK).optional(),
  desde: fechaDia.optional(),
  hasta: fechaDia.optional(),
});

export type FiltroProductos = zod.output<typeof esquemaFiltroProductos>;
export type DatosAltaCategoria = zod.input<typeof esquemaAltaCategoria>;
export type DatosEdicionCategoria = zod.input<typeof esquemaEdicionCategoria>;
export type DatosAltaProducto = zod.input<typeof esquemaAltaProducto>;
export type DatosEdicionProducto = zod.input<typeof esquemaEdicionProducto>;
export type DatosMovimientoManual = zod.input<typeof esquemaMovimientoManual>;
export type TipoMovimientoManual = DatosMovimientoManual['tipo'];
