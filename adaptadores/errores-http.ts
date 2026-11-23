import { inspect as describirErrorInesperado } from 'node:util';
import { ZodError } from 'zod';
import {
  ERRORES,
  type CodigoError,
  type DefinicionError,
} from '@/constantes/errores';
import { detallesDeZod } from '@/lib/errores-de-validacion';
import { ApiError, crearError } from '@/servicios/errores';

export type CuerpoError = {
  error: { code: CodigoError; message: string; details?: unknown };
};

type ErrorTraducido = { status: number; cuerpo: CuerpoError };

export function cuerpoDeError(definicion: DefinicionError): CuerpoError {
  return { error: { code: definicion.code, message: definicion.mensaje } };
}

function traducirErrorDeServicio(error: ApiError): ErrorTraducido {
  const { status, code, message, details } = error;
  return { status, cuerpo: { error: { code, message, details } } };
}

export function traducirErrorAHttp(error: unknown): ErrorTraducido {
  if (error instanceof ApiError) return traducirErrorDeServicio(error);
  if (error instanceof ZodError) {
    return traducirErrorDeServicio(
      crearError(ERRORES.VALIDACION, detallesDeZod(error))
    );
  }
  process.stderr.write(`${describirErrorInesperado(error)}\n`);
  return traducirErrorDeServicio(crearError(ERRORES.ERROR_INTERNO));
}
