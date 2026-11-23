import {
  ERRORES,
  type CodigoError,
  type DefinicionError,
} from '@/constantes/errores';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: CodigoError,
    message: string,
    readonly details?: unknown
  ) {
    super(message);
  }
}

export function crearError(
  definicion: DefinicionError,
  details?: unknown,
  mensaje: string = definicion.mensaje
) {
  return new ApiError(definicion.status, definicion.code, mensaje, details);
}

export function esErrorNoEncontrado(error: unknown) {
  return error instanceof ApiError && error.code === ERRORES.NO_ENCONTRADO.code;
}
