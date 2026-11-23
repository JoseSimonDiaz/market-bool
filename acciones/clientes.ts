'use server';

import { revalidatePath as refrescarPagina } from 'next/cache';
import { ejecutarAccionYRefrescar } from '@/adaptadores/acciones';
import { ALCANCE_REVALIDACION_LAYOUT, RUTAS } from '@/constantes/rutas';
import { crearCliente, editarCliente } from '@/servicios/clientes';
import { registrarPago } from '@/servicios/pagos';

function refrescarModuloClientes() {
  refrescarPagina(RUTAS.clientes, ALCANCE_REVALIDACION_LAYOUT);
}

export async function accionCrearCliente(altaSinValidar: unknown) {
  return ejecutarAccionYRefrescar(
    (usuarioActual) => crearCliente(usuarioActual, altaSinValidar),
    refrescarModuloClientes
  );
}

export async function accionEditarCliente(
  clienteId: number,
  cambiosSinValidar: unknown
) {
  return ejecutarAccionYRefrescar(
    (usuarioActual) =>
      editarCliente(usuarioActual, clienteId, cambiosSinValidar),
    refrescarModuloClientes
  );
}

export async function accionRegistrarPago(
  clienteId: number,
  pagoSinValidar: unknown
) {
  return ejecutarAccionYRefrescar(
    (usuarioActual) => registrarPago(usuarioActual, clienteId, pagoSinValidar),
    refrescarModuloClientes
  );
}
