import Link from 'next/link';
import { TableCell, TableRow } from '@/componentes/ui/table';
import { RUTAS } from '@/constantes/rutas';
import { formatearEntero, formatearMoneda } from '@/lib/formato';
import type { Tablero } from '@/servicios/tablero';

export type ProductoMasVendido = Tablero['masVendidos'][number];

export function FilaMasVendido({ producto }: { producto: ProductoMasVendido }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Link
          href={RUTAS.producto(producto.productoId)}
          className="font-mono text-xs hover:underline"
        >
          {producto.codigo}
        </Link>
      </TableCell>
      <TableCell>{producto.descripcion}</TableCell>
      <TableCell className="text-right tabular-nums">
        {formatearEntero(producto.unidades)}
      </TableCell>
      <TableCell className="hidden text-right tabular-nums sm:table-cell">
        {formatearMoneda(producto.importe)}
      </TableCell>
    </TableRow>
  );
}
