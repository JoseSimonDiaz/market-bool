export const METODO_HTTP = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  patch: 'PATCH',
} as const;

export type MetodoHttp = (typeof METODO_HTTP)[keyof typeof METODO_HTTP];

export const METODOS_CON_CUERPO: ReadonlySet<string> = new Set([
  METODO_HTTP.post,
  METODO_HTTP.put,
  METODO_HTTP.patch,
]);

export const ESTADO_HTTP = {
  ok: 200,
  creado: 201,
  sinContenido: 204,
} as const;

export const CABECERA_TIPO_CONTENIDO = 'Content-Type';
export const TIPO_CONTENIDO_JSON = 'application/json';

export const CUERPO_VACIO = {};
