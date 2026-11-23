import { migrate as aplicarMigraciones } from 'drizzle-orm/libsql/migrator';
import { baseDeDatos } from '@/basedatos/conexion';
import { CARPETA_MIGRACIONES } from '@/constantes/basedatos';
import { SALIDA_CON_ERROR, SALIDA_EXITOSA } from '@/constantes/scripts';
import { sembrarCatalogo } from '@/scripts/semilla';

async function prepararBaseDePruebasDelNavegador() {
  await aplicarMigraciones(baseDeDatos, {
    migrationsFolder: CARPETA_MIGRACIONES,
  });
  await sembrarCatalogo();
}

prepararBaseDePruebasDelNavegador().then(
  () => process.exit(SALIDA_EXITOSA),
  (error: unknown) => {
    process.stderr.write(`${String(error)}\n`);
    process.exit(SALIDA_CON_ERROR);
  }
);
