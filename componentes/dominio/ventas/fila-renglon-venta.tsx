'use client';

import { Trash2Icon } from 'lucide-react';
import { useCallback, type ChangeEvent } from 'react';
import { BotonIcono } from '@/componentes/comunes/boton-icono';
import { Input } from '@/componentes/ui/input';
import { TableCell, TableRow } from '@/componentes/ui/table';
import { CANTIDAD_INICIAL_RENGLON } from '@/constantes/interfaz';
import {
  formatearEntero,
  formatearMoneda,
  numeroATexto,
  textoANumero,
} from '@/lib/formato';
import { calcularSubtotal } from '@/lib/ventas';
import type { Producto } from '@/servicios/productos';

export type CambiosDelRenglon = {
  alCambiarCantidad: (producto: Producto, cantidad: number) => void;
  alQuitar: (productoId: number) => void;
};

export function FilaRenglonVenta({
  producto,
  cantidad,
  alCambiarCantidad,
  alQuitar,
}: CambiosDelRenglon & { producto: Producto; cantidad: number }) {
  const cambiarCantidad = useCallback(
    (evento: ChangeEvent<HTMLInputElement>) =>
      alCambiarCantidad(producto, textoANumero(evento.target.value)),
    [alCambiarCantidad, producto]
  );
  const quitar = useCallback(
    () => alQuitar(producto.id),
    [alQuitar, producto.id]
  );
  const subtotal = calcularSubtotal({
    cantidad,
    precioUnitario: producto.precio,
  });

  return (
    <TableRow>
      <TableCell className="max-w-56">
        <p className="truncate font-medium">{producto.descripcion}</p>
        <p className="text-xs text-muted-foreground">
          {producto.codigo} · Disponible {formatearEntero(producto.existencia)}
        </p>
      </TableCell>
      <TableCell className="w-24">
        <Input
          type="number"
          inputMode="numeric"
          aria-label={`Cantidad de ${producto.descripcion}`}
          min={CANTIDAD_INICIAL_RENGLON}
          max={producto.existencia}
          value={numeroATexto(cantidad)}
          onChange={cambiarCantidad}
        />
      </TableCell>
      <TableCell className="hidden text-right tabular-nums sm:table-cell">
        {formatearMoneda(producto.precio)}
      </TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {formatearMoneda(subtotal)}
      </TableCell>
      <TableCell>
        <BotonIcono icono={Trash2Icon} etiqueta="Quitar" onClick={quitar} />
      </TableCell>
    </TableRow>
  );
}
