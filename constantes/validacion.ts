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
  nombreCliente: 120,
  domicilio: 160,
  telefono: 40,
  email: 120,
  marcaTarjeta: 40,
  motivoAnulacion: 200,
} as const;

export const FORMATO_CODIGO_PRODUCTO = /^[A-Z0-9]+(-[A-Z0-9]+)*$/;
export const FORMATO_DIA = /^\d{4}-\d{2}-\d{2}$/;
export const FORMATO_ULTIMOS_DIGITOS_TARJETA = /^\d{4}$/;
