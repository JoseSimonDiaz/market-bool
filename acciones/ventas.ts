'use server';

import { revalidatePath as refrescarPagina } from 'next/cache';
import { ejecutarAccionYRefrescar } from '@/adaptadores/acciones';
import { ALCANCE_REVALIDACION_LAYOUT, RUTAS } from '@/constantes/rutas';
import { anularFactura } from '@/servicios/anulaciones';

function refrescarVistasAfectadasPorLaAnulacion() {
  refrescarPagina(RUTAS.ventas, ALCANCE_REVALIDACION_LAYOUT);
  refrescarPagina(RUTAS.clientes, ALCANCE_REVALIDACION_LAYOUT);
  refrescarPagina(RUTAS.productos, ALCANCE_REVALIDACION_LAYOUT);
}

export async function accionAnularFactura(
  facturaId: number,
  anulacionSinValidar: unknown
) {
  return ejecutarAccionYRefrescar(
    (usuarioActual) =>
      anularFactura(usuarioActual, facturaId, anulacionSinValidar),
    refrescarVistasAfectadasPorLaAnulacion
  );
}
