import type { ZodType } from 'zod';
import { esquemaDetallesPorCampo, type DetalleCampo } from '@/esquemas/comunes';
import { detallesDeZod } from '@/lib/errores-de-validacion';

export function aErroresPorCampo(detalles: DetalleCampo[]) {
  return Object.fromEntries(
    detalles.map(({ campo, mensaje }) => [campo, { message: mensaje }])
  );
}

export function validarConEsquema(esquema: ZodType) {
  return async ({ value: valores }: { value: unknown }) => {
    const validacion = await esquema.safeParseAsync(valores);
    if (validacion.success) return undefined;
    return { fields: aErroresPorCampo(detallesDeZod(validacion.error)) };
  };
}

export function detallesDelServidor(detalles: unknown): DetalleCampo[] {
  const detallesValidados = esquemaDetallesPorCampo.safeParse(detalles);
  return detallesValidados.success ? detallesValidados.data : [];
}
