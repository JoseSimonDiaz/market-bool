'use client';

import { useCallback } from 'react';
import { EstadoVacio } from '@/componentes/comunes/estados';
import { MarcoTabla } from '@/componentes/comunes/marco-tabla';
import { FilaRenglonVenta } from '@/componentes/dominio/ventas/fila-renglon-venta';
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/componentes/ui/table';
import type { RenglonDelFormulario } from '@/constantes/formularios';
import { cambiarCantidadDelRenglon, quitarDelPedido } from '@/lib/ventas';
import type { Producto } from '@/servicios/productos';

export function TablaRenglonesVenta({
  renglones,
  productos,
  alCambiar,
}: {
  renglones: RenglonDelFormulario[];
  productos: ReadonlyMap<number, Producto>;
  alCambiar: (renglones: RenglonDelFormulario[]) => void;
}) {
  const cambiarCantidad = useCallback(
    (producto: Producto, cantidad: number) =>
      alCambiar(
        cambiarCantidadDelRenglon(renglones, {
          productoId: producto.id,
          cantidad,
          existencia: producto.existencia,
        })
      ),
    [alCambiar, renglones]
  );
  const quitar = useCallback(
    (productoId: number) => alCambiar(quitarDelPedido(renglones, productoId)),
    [alCambiar, renglones]
  );

  if (renglones.length === 0) {
    return <EstadoVacio mensaje="Todavía no agregaste productos." />;
  }
  return (
    <MarcoTabla>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead className="hidden text-right sm:table-cell">
            Precio
          </TableHead>
          <TableHead className="text-right">Subtotal</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {renglones.map(({ productoId, cantidad }) => {
          const producto = productos.get(productoId);
          if (!producto) return null;
          return (
            <FilaRenglonVenta
              key={productoId}
              producto={producto}
              cantidad={cantidad}
              alCambiarCantidad={cambiarCantidad}
              alQuitar={quitar}
            />
          );
        })}
      </TableBody>
    </MarcoTabla>
  );
}
