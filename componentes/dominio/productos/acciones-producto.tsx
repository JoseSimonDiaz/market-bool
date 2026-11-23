'use client';

import { useCallback } from 'react';
import { accionEditarProducto } from '@/acciones/productos';
import { BotonCambiarEstado } from '@/componentes/comunes/boton-cambiar-estado';
import type { Opcion } from '@/lib/opciones';
import { BotonEditarProducto } from '@/componentes/dominio/productos/boton-editar-producto';
import { BotonMovimientoStock } from '@/componentes/dominio/productos/boton-movimiento-stock';
import { MOVIMIENTO_STOCK } from '@/constantes/dominio';
import { TEXTOS_ESTADO_PRODUCTO } from '@/constantes/etiquetas';
import type { Producto } from '@/servicios/productos';

export function AccionesProducto({
  producto,
  categorias,
}: {
  producto: Producto;
  categorias: Opcion<number>[];
}) {
  const cambiarEstado = useCallback(
    (activar: boolean) =>
      accionEditarProducto(producto.id, { activo: activar }),
    [producto.id]
  );

  return (
    <div className="flex flex-wrap gap-2">
      <BotonMovimientoStock
        producto={producto}
        tipo={MOVIMIENTO_STOCK.ingreso}
      />
      <BotonMovimientoStock
        producto={producto}
        tipo={MOVIMIENTO_STOCK.egreso}
      />
      <BotonEditarProducto producto={producto} categorias={categorias} />
      <BotonCambiarEstado
        activo={producto.activo}
        textos={TEXTOS_ESTADO_PRODUCTO}
        cambiarEstado={cambiarEstado}
      />
    </div>
  );
}
