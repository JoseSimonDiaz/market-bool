import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./', import.meta.url)) } },
  test: {
    include: ['pruebas/**/*.test.ts'],
    fileParallelism: false,
    // Base propia para los tests: nunca toca local.db ni Turso.
    env: {
      DATABASE_URL: 'file:pruebas/prueba.db',
      SESSION_SECRET: 'secreto-de-pruebas-con-mas-de-32-caracteres',
    },
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
