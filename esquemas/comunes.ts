import { z as zod } from 'zod';
import { MENSAJES_VALIDACION } from '@/constantes/mensajes';
import {
  ESTADOS_FILTRO,
  PAGINA,
  type EstadoFiltro,
} from '@/constantes/dominio';

zod.config(zod.locales.es());

export const esquemaPaginacion = zod.object({
  page: zod.coerce.number().int().min(1).default(1),
  pageSize: zod.coerce
    .number()
    .int()
    .min(1)
    .max(PAGINA.tamanioMaximo)
    .default(PAGINA.tamanioPorDefecto),
});

export const esquemaId = zod.coerce.number().int().positive();

export const textoObligatorio = (maximo: number) =>
  zod
    .string()
    .trim()
    .min(1, MENSAJES_VALIDACION.obligatorio)
    .max(maximo, MENSAJES_VALIDACION.maximoCaracteres(maximo));

export const textoOpcional = (maximo: number) =>
  zod
    .string()
    .trim()
    .max(maximo, MENSAJES_VALIDACION.maximoCaracteres(maximo))
    .transform((textoIngresado) => textoIngresado || null)
    .nullable()
    .optional();

export const booleanoDeUrl = zod.stringbool();

export const estadoFiltroConDefecto = (estadoPorDefecto: EstadoFiltro) =>
  zod.enum(ESTADOS_FILTRO).default(estadoPorDefecto);

export const fechaDia = zod
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, MENSAJES_VALIDACION.formatoDia);

export const esquemaDetalleCampo = zod.object({
  campo: zod.string(),
  mensaje: zod.string(),
});

export const esquemaDetallesPorCampo = zod.array(esquemaDetalleCampo).min(1);

export type DetalleCampo = zod.infer<typeof esquemaDetalleCampo>;
