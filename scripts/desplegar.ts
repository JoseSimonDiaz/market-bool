import { eq as esIgualA } from 'drizzle-orm';
import { migrate as aplicarMigraciones } from 'drizzle-orm/libsql/migrator';
import { baseDeDatos } from '@/basedatos/conexion';
import { configuracion } from '@/basedatos/esquema';
import {
  CARPETA_MIGRACIONES,
  CLAVE_ULTIMO_SEED_RESET,
} from '@/constantes/basedatos';
import {
  CONFIG,
  ENTORNO_PRODUCCION,
  PREFIJO_BASE_LOCAL,
  secretoDeSesionValidoParaProduccion,
} from '@/constantes/config';
import { MENSAJES_DESPLIEGUE } from '@/constantes/mensajes';
import { SALIDA_CON_ERROR, SALIDA_EXITOSA } from '@/constantes/scripts';
import { baseVacia, sembrar } from '@/scripts/semilla';

function informar(mensaje: string) {
  process.stdout.write(`${mensaje}\n`);
}

function exigirEntornoDeProduccionCompleto() {
  if (CONFIG.urlBaseDatos.startsWith(PREFIJO_BASE_LOCAL)) {
    throw new Error(MENSAJES_DESPLIEGUE.faltaBaseDeDatos);
  }
  if (!secretoDeSesionValidoParaProduccion()) {
    throw new Error(MENSAJES_DESPLIEGUE.faltaSecretoDeSesion);
  }
}

async function reinicioYaAplicado(valorPedido: string) {
  const [ultimoReinicio] = await baseDeDatos
    .select({ valor: configuracion.valor })
    .from(configuracion)
    .where(esIgualA(configuracion.clave, CLAVE_ULTIMO_SEED_RESET));
  return ultimoReinicio?.valor === valorPedido;
}

async function registrarReinicio(valorAplicado: string) {
  await baseDeDatos
    .insert(configuracion)
    .values({ clave: CLAVE_ULTIMO_SEED_RESET, valor: valorAplicado })
    .onConflictDoUpdate({
      target: configuracion.clave,
      set: { valor: valorAplicado },
    });
}

async function recargarPorSeedReset(valorPedido: string) {
  informar(MENSAJES_DESPLIEGUE.recargaPorSeedReset(valorPedido));
  await sembrar();
  await registrarReinicio(valorPedido);
}

async function cargarDatosDePrueba() {
  const valorPedido = CONFIG.reinicioSemilla;
  if (valorPedido && !(await reinicioYaAplicado(valorPedido))) {
    return recargarPorSeedReset(valorPedido);
  }
  if (await baseVacia()) {
    informar(MENSAJES_DESPLIEGUE.baseVacia);
    return sembrar();
  }
  informar(MENSAJES_DESPLIEGUE.baseConDatos);
}

async function desplegar() {
  const entornoVercel = CONFIG.entornoVercel ?? '';
  if (entornoVercel && entornoVercel !== ENTORNO_PRODUCCION) {
    informar(MENSAJES_DESPLIEGUE.deployQueNoTocaLaBase(entornoVercel));
    return;
  }
  if (entornoVercel) exigirEntornoDeProduccionCompleto();
  informar(MENSAJES_DESPLIEGUE.aplicandoMigraciones);
  await aplicarMigraciones(baseDeDatos, {
    migrationsFolder: CARPETA_MIGRACIONES,
  });
  await cargarDatosDePrueba();
}

try {
  await desplegar();
  process.exit(SALIDA_EXITOSA);
} catch (falla) {
  process.stderr.write(`${falla}\n`);
  process.exit(SALIDA_CON_ERROR);
}
