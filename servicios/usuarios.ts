import { randomBytes as generarBytesAleatorios } from 'node:crypto';
import {
  and as cumplenTodas,
  asc as ascendente,
  eq as esIgualA,
  type SQL,
} from 'drizzle-orm';
import { baseDeDatos } from '@/basedatos/conexion';
import { COLUMNAS_BUSQUEDA_USUARIOS } from '@/basedatos/busquedas';
import {
  condicionDeBusqueda,
  condicionDeEstado,
  consultarPagina,
  type Paginado,
} from '@/basedatos/consultas';
import { usuarios } from '@/basedatos/esquema';
import { ROL } from '@/constantes/dominio';
import { ERRORES } from '@/constantes/errores';
import {
  CODIFICACION_PASSWORD_TEMPORAL,
  LARGO_PASSWORD_TEMPORAL,
} from '@/constantes/seguridad';
import { esquemaId } from '@/esquemas/comunes';
import {
  esquemaAltaUsuario,
  esquemaEdicionUsuario,
  esquemaFiltroUsuarios,
  type DatosEdicionUsuario,
  type UsuarioSesion,
} from '@/esquemas/usuarios';
import { columnasUsuarioPublico, hashearPassword } from '@/servicios/auth';
import { crearError } from '@/servicios/errores';
import { exigirAdmin } from '@/servicios/permisos';
import { exigirValorUnico, hayCambios } from '@/servicios/reglas-comunes';

const columnasUsuario = {
  ...columnasUsuarioPublico,
  activo: usuarios.activo,
  creadoEn: usuarios.creadoEn,
};

export type Usuario = UsuarioSesion & { activo: boolean; creadoEn: string };

async function buscarUsuarioPorId(usuarioId: number) {
  const [usuarioEncontrado] = await baseDeDatos
    .select(columnasUsuario)
    .from(usuarios)
    .where(esIgualA(usuarios.id, usuarioId));
  if (!usuarioEncontrado) throw crearError(ERRORES.NO_ENCONTRADO);
  return usuarioEncontrado;
}

function exigirEmailLibre(email: string, idExcluido?: number) {
  return exigirValorUnico({
    tabla: usuarios,
    columna: usuarios.email,
    valorBuscado: email,
    idExcluido,
    errorSiExiste: ERRORES.EMAIL_DUPLICADO,
    campo: esquemaAltaUsuario.keyof().enum.email,
  });
}

function buscarFilasDeUsuarios(filtro: SQL | undefined) {
  return (limite: number, desplazamiento: number) =>
    baseDeDatos
      .select(columnasUsuario)
      .from(usuarios)
      .where(filtro)
      .orderBy(ascendente(usuarios.nombre))
      .limit(limite)
      .offset(desplazamiento);
}

// Gestión de usuarios: alta, edición, baja y rol; un usuario desactivado no entra.
export async function listarUsuarios(
  usuarioActual: UsuarioSesion,
  filtrosSinValidar: unknown
): Promise<Paginado<Usuario>> {
  const filtros = esquemaFiltroUsuarios.parse(filtrosSinValidar);
  exigirAdmin(usuarioActual);
  const filtro = cumplenTodas(
    condicionDeBusqueda(COLUMNAS_BUSQUEDA_USUARIOS, filtros.q),
    condicionDeEstado(usuarios.activo, filtros.estado)
  );
  return consultarPagina({
    page: filtros.page,
    pageSize: filtros.pageSize,
    total: baseDeDatos.$count(usuarios, filtro),
    buscarFilas: buscarFilasDeUsuarios(filtro),
  });
}

// Gestión de usuarios: alta, edición, baja y rol; un usuario desactivado no entra.
export async function crearUsuario(
  usuarioActual: UsuarioSesion,
  altaSinValidar: unknown
): Promise<Usuario> {
  const { password, ...alta } = esquemaAltaUsuario.parse(altaSinValidar);
  exigirAdmin(usuarioActual);
  await exigirEmailLibre(alta.email);
  const [creado] = await baseDeDatos
    .insert(usuarios)
    .values({ ...alta, passwordHash: await hashearPassword(password) })
    .returning(columnasUsuario);
  return creado;
}

function exigirQueNoPierdaSuAcceso(
  usuarioActual: UsuarioSesion,
  usuarioId: number,
  cambios: DatosEdicionUsuario
) {
  const editaSuPropioUsuario = usuarioId === usuarioActual.id;
  const seDesactiva = cambios.activo === false;
  const dejaDeSerAdmin = Boolean(cambios.rol) && cambios.rol !== ROL.admin;
  if (editaSuPropioUsuario && (seDesactiva || dejaDeSerAdmin)) {
    throw crearError(ERRORES.OPERACION_SOBRE_SI_MISMO);
  }
}

// Gestión de usuarios: alta, edición, baja y rol; un usuario desactivado no entra.
export async function editarUsuario(
  usuarioActual: UsuarioSesion,
  idSinValidar: unknown,
  cambiosSinValidar: unknown
): Promise<Usuario> {
  const usuarioId = esquemaId.parse(idSinValidar);
  const cambios = esquemaEdicionUsuario.parse(cambiosSinValidar);
  exigirAdmin(usuarioActual);
  await buscarUsuarioPorId(usuarioId);
  exigirQueNoPierdaSuAcceso(usuarioActual, usuarioId, cambios);
  if (cambios.email) await exigirEmailLibre(cambios.email, usuarioId);
  if (!hayCambios(cambios)) return buscarUsuarioPorId(usuarioId);
  const [editado] = await baseDeDatos
    .update(usuarios)
    .set(cambios)
    .where(esIgualA(usuarios.id, usuarioId))
    .returning(columnasUsuario);
  return editado;
}

function generarPasswordTemporal() {
  return generarBytesAleatorios(LARGO_PASSWORD_TEMPORAL)
    .toString(CODIFICACION_PASSWORD_TEMPORAL)
    .slice(0, LARGO_PASSWORD_TEMPORAL);
}

// Contraseñas: el admin las restablece y cada usuario cambia la suya.
export async function restablecerPassword(
  usuarioActual: UsuarioSesion,
  idSinValidar: unknown
) {
  const usuarioId = esquemaId.parse(idSinValidar);
  exigirAdmin(usuarioActual);
  await buscarUsuarioPorId(usuarioId);
  const passwordTemporal = generarPasswordTemporal();
  await baseDeDatos
    .update(usuarios)
    .set({ passwordHash: await hashearPassword(passwordTemporal) })
    .where(esIgualA(usuarios.id, usuarioId));
  return { passwordTemporal };
}
