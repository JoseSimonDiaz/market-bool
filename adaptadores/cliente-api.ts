import { ERRORES } from '@/constantes/errores';
import {
  CABECERA_TIPO_CONTENIDO,
  TIPO_CONTENIDO_JSON,
  type MetodoHttp,
} from '@/constantes/http';
import { MENSAJES_SISTEMA } from '@/constantes/mensajes';
import type { ResultadoAccion } from '@/adaptadores/acciones';

export async function llamarApi<Respuesta>(
  ruta: string,
  metodo: MetodoHttp,
  cuerpo?: unknown
): Promise<ResultadoAccion<Respuesta>> {
  try {
    const respuestaHttp = await fetch(ruta, {
      method: metodo,
      headers: { [CABECERA_TIPO_CONTENIDO]: TIPO_CONTENIDO_JSON },
      body: JSON.stringify(cuerpo),
    });
    const cuerpoDeRespuesta = await respuestaHttp.json();
    if (respuestaHttp.ok) return { ok: true, data: cuerpoDeRespuesta };
    return { ok: false, error: cuerpoDeRespuesta.error };
  } catch (_servidorInaccesible) {
    return {
      ok: false,
      error: {
        code: ERRORES.ERROR_INTERNO.code,
        message: MENSAJES_SISTEMA.sinConexion,
      },
    };
  }
}
