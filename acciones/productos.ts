'use server';

import { revalidatePath as refrescarPagina } from 'next/cache';
import { ejecutarAccionYRefrescar } from '@/adaptadores/acciones';
import { ALCANCE_REVALIDACION_LAYOUT, RUTAS } from '@/constantes/rutas';
import { crearCategoria, editarCategoria } from '@/servicios/categorias';
import { crearProducto, editarProducto } from '@/servicios/productos';
import { registrarMovimientoManual } from '@/servicios/stock';

function refrescarModuloProductos() {
  refrescarPagina(RUTAS.productos, ALCANCE_REVALIDACION_LAYOUT);
}

export async function accionCrearProducto(altaSinValidar: unknown) {
  return ejecutarAccionYRefrescar(
    (usuarioActual) => crearProducto(usuarioActual, altaSinValidar),
    refrescarModuloProductos
  );
}

export async function accionEditarProducto(
  productoId: number,
  cambiosSinValidar: unknown
) {
  return ejecutarAccionYRefrescar(
    (usuarioActual) =>
      editarProducto(usuarioActual, productoId, cambiosSinValidar),
    refrescarModuloProductos
  );
}

export async function accionMoverStock(
  productoId: number,
  movimientoSinValidar: unknown
) {
  return ejecutarAccionYRefrescar(
    (usuarioActual) =>
      registrarMovimientoManual(
        usuarioActual,
        productoId,
        movimientoSinValidar
      ),
    refrescarModuloProductos
  );
}

export async function accionCrearCategoria(altaSinValidar: unknown) {
  return ejecutarAccionYRefrescar(
    (usuarioActual) => crearCategoria(usuarioActual, altaSinValidar),
    refrescarModuloProductos
  );
}

export async function accionEditarCategoria(
  categoriaId: number,
  cambiosSinValidar: unknown
) {
  return ejecutarAccionYRefrescar(
    (usuarioActual) =>
      editarCategoria(usuarioActual, categoriaId, cambiosSinValidar),
    refrescarModuloProductos
  );
}
