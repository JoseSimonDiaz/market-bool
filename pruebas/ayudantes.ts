import { eq as esIgualA } from 'drizzle-orm';
import { migrate as aplicarMigraciones } from 'drizzle-orm/libsql/migrator';
import { baseDeDatos } from '@/basedatos/conexion';
import { usuarios } from '@/basedatos/esquema';
import { CARPETA_MIGRACIONES } from '@/constantes/basedatos';
import { buscarUsuarioActivo } from '@/servicios/auth';
import { sembrarCatalogo } from '@/scripts/semilla';

export async function sesionDe(email: string) {
  const [usuarioEncontrado] = await baseDeDatos
    .select({ id: usuarios.id })
    .from(usuarios)
    .where(esIgualA(usuarios.email, email));
  const usuarioActivo = await buscarUsuarioActivo(usuarioEncontrado.id);
  if (!usuarioActivo) throw new Error(`Sin usuario ${email}`);
  return usuarioActivo;
}

export async function prepararBaseConDatosDePrueba() {
  await aplicarMigraciones(baseDeDatos, {
    migrationsFolder: CARPETA_MIGRACIONES,
  });
  await sembrarCatalogo();
}
