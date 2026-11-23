import { existsSync as existeArchivo } from 'node:fs';
import { z as zod } from 'zod';

export const ARCHIVO_ENTORNO = '.env';
export const ENTORNO_PRODUCCION = 'production';
export const PREFIJO_BASE_LOCAL = 'file:';
export const BASE_LOCAL_POR_DEFECTO = `${PREFIJO_BASE_LOCAL}local.db`;
export const LARGO_MINIMO_SECRETO_SESION = 32;
export const SECRETO_DE_EJEMPLO =
  'cambiar-por-un-secreto-largo-de-al-menos-32-caracteres';

if (existeArchivo(ARCHIVO_ENTORNO)) process.loadEnvFile(ARCHIVO_ENTORNO);

const esquemaEntorno = zod.object({
  urlBaseDatos: zod.string().min(1),
  tokenBaseDatos: zod.string().optional(),
  secretoSesion: zod.string().optional(),
  esProduccion: zod.boolean(),
  entornoVercel: zod.string().optional(),
  reinicioSemilla: zod.string().optional(),
});

const esquemaSecretoDeSesion = zod
  .string(`Falta SESSION_SECRET`)
  .min(
    LARGO_MINIMO_SECRETO_SESION,
    `SESSION_SECRET debe tener al menos ${LARGO_MINIMO_SECRETO_SESION} caracteres`
  );

export const CONFIG = esquemaEntorno.parse({
  urlBaseDatos:
    process.env.DATABASE_URL ||
    process.env.TURSO_DATABASE_URL ||
    BASE_LOCAL_POR_DEFECTO,
  tokenBaseDatos:
    process.env.DATABASE_AUTH_TOKEN ||
    process.env.TURSO_AUTH_TOKEN ||
    undefined,
  secretoSesion: process.env.SESSION_SECRET || undefined,
  esProduccion: process.env.NODE_ENV === ENTORNO_PRODUCCION,
  entornoVercel: process.env.VERCEL_ENV,
  reinicioSemilla: process.env.SEED_RESET || undefined,
});

export function obtenerSecretoDeSesion() {
  return esquemaSecretoDeSesion.parse(CONFIG.secretoSesion);
}

export function secretoDeSesionValidoParaProduccion() {
  const validacion = esquemaSecretoDeSesion.safeParse(CONFIG.secretoSesion);
  return validacion.success && validacion.data !== SECRETO_DE_EJEMPLO;
}
