import { z as zod } from 'zod';
import {
  LARGO_CUIT,
  LARGO_DNI,
  MEDIOS_PAGO,
  ORDEN_CLIENTES,
  ORDENES_CLIENTES,
  TIPO_DOCUMENTO,
  TIPOS_DOCUMENTO,
} from '@/constantes/dominio';
import { MENSAJES_VALIDACION } from '@/constantes/mensajes';
import { LARGO_MAXIMO } from '@/constantes/validacion';
import {
  booleanoDeUrl,
  esquemaPaginacion,
  fechaDia,
  textoObligatorio,
  textoOpcional,
} from '@/esquemas/comunes';
import { soloDigitos } from '@/lib/formato';

const numeroDeDocumento = zod
  .string()
  .trim()
  .transform(soloDigitos)
  .pipe(zod.string().min(1, MENSAJES_VALIDACION.obligatorio));

const emailOpcional = zod
  .string()
  .trim()
  .toLowerCase()
  .transform((emailIngresado) => emailIngresado || null)
  .pipe(zod.email(MENSAJES_VALIDACION.emailInvalido).nullable())
  .nullable()
  .optional();

const importeOpcional = zod
  .union([
    zod.nan().transform(() => null),
    zod
      .number()
      .int(MENSAJES_VALIDACION.importeEnCentavos)
      .nonnegative(MENSAJES_VALIDACION.noNegativo),
  ])
  .nullable()
  .optional();

const camposDeCliente = {
  tipoDoc: zod.enum(TIPOS_DOCUMENTO, MENSAJES_VALIDACION.elegirTipoDocumento),
  nroDoc: numeroDeDocumento,
  nombre: textoObligatorio(LARGO_MAXIMO.nombreCliente),
  domicilio: textoOpcional(LARGO_MAXIMO.domicilio),
  telefono: textoOpcional(LARGO_MAXIMO.telefono),
  email: emailOpcional,
  cuentaCorriente: zod.boolean().optional(),
  limiteCredito: importeOpcional,
};

type DocumentoIngresado = { tipoDoc?: string; nroDoc?: string };

function dniConLargoValido({ tipoDoc, nroDoc }: DocumentoIngresado) {
  if (tipoDoc !== TIPO_DOCUMENTO.dni || !nroDoc) return true;
  return nroDoc.length >= LARGO_DNI.minimo && nroDoc.length <= LARGO_DNI.maximo;
}

function cuitConLargoValido({ tipoDoc, nroDoc }: DocumentoIngresado) {
  if (tipoDoc !== TIPO_DOCUMENTO.cuit || !nroDoc) return true;
  return nroDoc.length === LARGO_CUIT;
}

function conDocumentoValido<Esquema extends zod.ZodType<DocumentoIngresado>>(
  esquema: Esquema
) {
  const campoDelDocumento = zod.strictObject(camposDeCliente).keyof()
    .enum.nroDoc;
  return esquema
    .refine(dniConLargoValido, {
      path: [campoDelDocumento],
      message: MENSAJES_VALIDACION.dniInvalido,
    })
    .refine(cuitConLargoValido, {
      path: [campoDelDocumento],
      message: MENSAJES_VALIDACION.cuitInvalido,
    });
}

export const esquemaAltaCliente = conDocumentoValido(
  zod.strictObject({
    ...camposDeCliente,
    cuentaCorriente: zod.boolean().default(false),
  })
);

export const esquemaEdicionCliente = conDocumentoValido(
  zod
    .strictObject(camposDeCliente)
    .partial()
    .extend({ activo: zod.boolean().optional() })
);

export const esquemaFiltroClientes = esquemaPaginacion.extend({
  q: zod.string().trim().optional(),
  conDeuda: booleanoDeUrl.default(false),
  orden: zod.enum(ORDENES_CLIENTES).default(ORDEN_CLIENTES.nombre),
});

export const esquemaFiltroCuenta = zod.object({
  desde: fechaDia.optional(),
  hasta: fechaDia.optional(),
});

export const esquemaPago = zod.strictObject({
  importe: zod
    .number(MENSAJES_VALIDACION.ingresarImporte)
    .int(MENSAJES_VALIDACION.importeEnCentavos)
    .positive(MENSAJES_VALIDACION.mayorQueCero),
  medio: zod.enum(MEDIOS_PAGO, MENSAJES_VALIDACION.elegirMedioPago),
  observacion: textoOpcional(LARGO_MAXIMO.observacion),
});

export type FiltroClientes = zod.output<typeof esquemaFiltroClientes>;
export type DatosAltaCliente = zod.input<typeof esquemaAltaCliente>;
export type DatosEdicionCliente = zod.input<typeof esquemaEdicionCliente>;
export type DatosPago = zod.input<typeof esquemaPago>;
