import {
  traducirErrorAHttp,
  type CuerpoError,
} from '@/adaptadores/errores-http';
import { exigirUsuario } from '@/adaptadores/sesion';
import type { UsuarioSesion } from '@/esquemas/usuarios';

export type ResultadoAccion<Respuesta> =
  { ok: true; data: Respuesta } | { ok: false; error: CuerpoError['error'] };

type Manejador<Respuesta> = (
  usuarioActual: UsuarioSesion
) => Promise<Respuesta>;

export async function ejecutarAccion<Respuesta>(
  manejador: Manejador<Respuesta>
): Promise<ResultadoAccion<Respuesta>> {
  try {
    return { ok: true, data: await manejador(await exigirUsuario()) };
  } catch (error) {
    return { ok: false, error: traducirErrorAHttp(error).cuerpo.error };
  }
}

export async function ejecutarAccionYRefrescar<Respuesta>(
  manejador: Manejador<Respuesta>,
  refrescarVistas: () => void
): Promise<ResultadoAccion<Respuesta>> {
  try {
    return await ejecutarAccion(manejador);
  } finally {
    refrescarVistas();
  }
}
