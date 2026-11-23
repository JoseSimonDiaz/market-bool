import type { ZodError } from 'zod';
import {
  CODIGO_ZOD_CLAVE_DESCONOCIDA,
  MENSAJE_CAMPO_NO_PERMITIDO,
  SEPARADOR_RUTA_CAMPO,
} from '@/constantes/validacion';
import type { DetalleCampo } from '@/esquemas/comunes';

type ProblemaDeZod = ZodError['issues'][number];

function rutaDelCampo(segmentos: PropertyKey[]) {
  return segmentos.map(String).join(SEPARADOR_RUTA_CAMPO);
}

function detalleDeProblema(problema: ProblemaDeZod): DetalleCampo[] {
  if (problema.code !== CODIGO_ZOD_CLAVE_DESCONOCIDA) {
    return [{ campo: rutaDelCampo(problema.path), mensaje: problema.message }];
  }
  return problema.keys.map((claveNoPermitida) => ({
    campo: rutaDelCampo([...problema.path, claveNoPermitida]),
    mensaje: MENSAJE_CAMPO_NO_PERMITIDO,
  }));
}

export function detallesDeZod(error: ZodError): DetalleCampo[] {
  return error.issues.flatMap(detalleDeProblema);
}
