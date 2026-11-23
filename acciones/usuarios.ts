'use server';

import { revalidatePath as refrescarPagina } from 'next/cache';
import {
  ejecutarAccion,
  ejecutarAccionYRefrescar,
} from '@/adaptadores/acciones';
import { RUTAS } from '@/constantes/rutas';
import {
  crearUsuario,
  editarUsuario,
  restablecerPassword,
} from '@/servicios/usuarios';

function refrescarListaDeUsuarios() {
  refrescarPagina(RUTAS.usuarios);
}

export async function accionCrearUsuario(altaSinValidar: unknown) {
  return ejecutarAccionYRefrescar(
    (usuarioActual) => crearUsuario(usuarioActual, altaSinValidar),
    refrescarListaDeUsuarios
  );
}

export async function accionEditarUsuario(
  usuarioId: number,
  cambiosSinValidar: unknown
) {
  return ejecutarAccionYRefrescar(
    (usuarioActual) =>
      editarUsuario(usuarioActual, usuarioId, cambiosSinValidar),
    refrescarListaDeUsuarios
  );
}

export async function accionRestablecerPassword(usuarioId: number) {
  return ejecutarAccion((usuarioActual) =>
    restablecerPassword(usuarioActual, usuarioId)
  );
}
