import { cookies as obtenerCookies } from 'next/headers';
import { redirect as redirigir } from 'next/navigation';
import { cache as memorizarPorPedido } from 'react';
import { CONFIG } from '@/constantes/config';
import { ERRORES } from '@/constantes/errores';
import { RUTAS } from '@/constantes/rutas';
import {
  DURACION_SESION_SEGUNDOS,
  NOMBRE_COOKIE_SESION,
  POLITICA_SAME_SITE,
  RUTA_COOKIE,
} from '@/constantes/seguridad';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { firmarToken, leerSesionDelToken } from '@/lib/token';
import { buscarUsuarioActivo } from '@/servicios/auth';
import { crearError } from '@/servicios/errores';

export async function abrirSesion(usuarioAutenticado: UsuarioSesion) {
  const cookies = await obtenerCookies();
  const token = await firmarToken({
    usuarioId: usuarioAutenticado.id,
    rol: usuarioAutenticado.rol,
  });
  cookies.set(NOMBRE_COOKIE_SESION, token, {
    httpOnly: true,
    sameSite: POLITICA_SAME_SITE,
    secure: CONFIG.esProduccion,
    path: RUTA_COOKIE,
    maxAge: DURACION_SESION_SEGUNDOS,
  });
}

export async function cerrarSesion() {
  const cookies = await obtenerCookies();
  cookies.delete(NOMBRE_COOKIE_SESION);
}

export const obtenerUsuario = memorizarPorPedido(
  async (): Promise<UsuarioSesion | null> => {
    const cookies = await obtenerCookies();
    const sesion = await leerSesionDelToken(
      cookies.get(NOMBRE_COOKIE_SESION)?.value
    );
    if (!sesion) return null;
    return buscarUsuarioActivo(sesion.usuarioId);
  }
);

export async function exigirUsuario() {
  const usuario = await obtenerUsuario();
  if (!usuario) throw crearError(ERRORES.NO_AUTENTICADO);
  return usuario;
}

export async function usuarioDePaginaOLogin() {
  const usuario = await obtenerUsuario();
  if (!usuario) redirigir(RUTAS.login);
  return usuario;
}
