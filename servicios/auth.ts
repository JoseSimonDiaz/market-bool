import {
  compare as coincidePassword,
  hash as calcularHashPassword,
} from 'bcryptjs';
import { and as cumplenTodas, eq as esIgualA } from 'drizzle-orm';
import { baseDeDatos } from '@/basedatos/conexion';
import { usuarios } from '@/basedatos/esquema';
import { ERRORES } from '@/constantes/errores';
import { COSTO_HASH_PASSWORD } from '@/constantes/seguridad';
import {
  esquemaCambioPassword,
  esquemaLogin,
  type UsuarioSesion,
} from '@/esquemas/usuarios';
import { crearError } from '@/servicios/errores';

export const columnasUsuarioPublico = {
  id: usuarios.id,
  nombre: usuarios.nombre,
  email: usuarios.email,
  rol: usuarios.rol,
};

export function hashearPassword(password: string) {
  return calcularHashPassword(password, COSTO_HASH_PASSWORD);
}

async function buscarCredencialesPorEmail(email: string) {
  const [credenciales] = await baseDeDatos
    .select({
      usuario: columnasUsuarioPublico,
      activo: usuarios.activo,
      passwordHash: usuarios.passwordHash,
    })
    .from(usuarios)
    .where(esIgualA(usuarios.email, email));
  return credenciales;
}

// Sesión: inicio con email y contraseña.
// Gestión de usuarios: alta, edición, baja y rol; un usuario desactivado no entra.
export async function iniciarSesion(
  credencialesSinValidar: unknown
): Promise<UsuarioSesion> {
  const { email, password } = esquemaLogin.parse(credencialesSinValidar);
  const credenciales = await buscarCredencialesPorEmail(email);
  const passwordCorrecta =
    credenciales &&
    (await coincidePassword(password, credenciales.passwordHash));
  if (!passwordCorrecta || !credenciales.activo) {
    throw crearError(ERRORES.CREDENCIALES_INVALIDAS);
  }
  return credenciales.usuario;
}

// Protección: toda operación exige una sesión válida.
export async function buscarUsuarioActivo(
  usuarioId: number
): Promise<UsuarioSesion | null> {
  const [usuarioActivo] = await baseDeDatos
    .select(columnasUsuarioPublico)
    .from(usuarios)
    .where(
      cumplenTodas(
        esIgualA(usuarios.id, usuarioId),
        esIgualA(usuarios.activo, true)
      )
    );
  return usuarioActivo ?? null;
}

async function exigirPasswordActual(usuarioId: number, passwordActual: string) {
  const [credencialGuardada] = await baseDeDatos
    .select({ passwordHash: usuarios.passwordHash })
    .from(usuarios)
    .where(esIgualA(usuarios.id, usuarioId));
  if (await coincidePassword(passwordActual, credencialGuardada.passwordHash)) {
    return;
  }
  throw crearError(ERRORES.CONTRASENA_ACTUAL_INCORRECTA, [
    {
      campo: esquemaCambioPassword.keyof().enum.actual,
      mensaje: ERRORES.CONTRASENA_ACTUAL_INCORRECTA.mensaje,
    },
  ]);
}

// Contraseñas: el admin las restablece y cada usuario cambia la suya.
export async function cambiarPassword(
  usuarioActual: UsuarioSesion,
  passwordsSinValidar: unknown
) {
  const { actual, nueva } = esquemaCambioPassword.parse(passwordsSinValidar);
  await exigirPasswordActual(usuarioActual.id, actual);
  await baseDeDatos
    .update(usuarios)
    .set({ passwordHash: await hashearPassword(nueva) })
    .where(esIgualA(usuarios.id, usuarioActual.id));
}
