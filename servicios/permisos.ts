import { ROL } from '@/constantes/dominio';
import { ERRORES } from '@/constantes/errores';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { crearError } from '@/servicios/errores';

export function esAdmin(usuario: UsuarioSesion) {
  return usuario.rol === ROL.admin;
}

export function exigirAdmin(usuario: UsuarioSesion) {
  if (!esAdmin(usuario)) throw crearError(ERRORES.SIN_PERMISO);
}
