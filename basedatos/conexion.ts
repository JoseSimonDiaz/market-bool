import { createClient as crearClienteLibsql } from '@libsql/client';
import { drizzle as crearOrmDrizzle } from 'drizzle-orm/libsql';
import { ESPERA_POR_BLOQUEO_DE_ARCHIVO_MS } from '../constantes/basedatos';
import { CONFIG } from '../constantes/config';
import * as esquema from './esquema';

export const clienteBaseDatos = crearClienteLibsql({
  url: CONFIG.urlBaseDatos,
  authToken: CONFIG.tokenBaseDatos,
  timeout: ESPERA_POR_BLOQUEO_DE_ARCHIVO_MS,
});

export const baseDeDatos = crearOrmDrizzle(clienteBaseDatos, {
  schema: esquema,
});

export type BaseDatos = typeof baseDeDatos;
export type Transaccion = Parameters<
  Parameters<BaseDatos['transaction']>[0]
>[0];
export type Ejecutor = BaseDatos | Transaccion;

let transaccionesPendientes: Promise<unknown> = Promise.resolve();

const continuarConLaSiguiente = () => undefined;

export function ejecutarEnTransaccionSerializada<Retorno>(
  trabajo: (transaccion: Transaccion) => Promise<Retorno>
) {
  const transaccionEncolada = transaccionesPendientes.then(() =>
    baseDeDatos.transaction(trabajo)
  );
  transaccionesPendientes = transaccionEncolada.catch(continuarConLaSiguiente);
  return transaccionEncolada;
}
