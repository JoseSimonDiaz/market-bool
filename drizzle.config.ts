import { defineConfig } from 'drizzle-kit';
import { CONFIG } from './constantes/config';

export default defineConfig({
  dialect: 'turso',
  schema: './basedatos/esquema.ts',
  out: './basedatos/migraciones',
  dbCredentials: { url: CONFIG.urlBaseDatos, authToken: CONFIG.tokenBaseDatos },
});
