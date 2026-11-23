import type { core } from 'zod';

export const CODIGO_ZOD_CLAVE_DESCONOCIDA: core.$ZodIssueUnrecognizedKeys['code'] =
  'unrecognized_keys';

export const SEPARADOR_RUTA_CAMPO = '.';
export const MENSAJE_CAMPO_NO_PERMITIDO = 'Campo no permitido.';

export const LARGO_MAXIMO = {
  nombreCategoria: 60,
  codigoProducto: 20,
  descripcionProducto: 120,
  observacion: 200,
  nombreUsuario: 100,
} as const;

export const FORMATO_CODIGO_PRODUCTO = /^[A-Z0-9]+(-[A-Z0-9]+)*$/;
