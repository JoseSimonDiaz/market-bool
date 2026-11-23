import { MarcoTabla } from '@/componentes/comunes/marco-tabla';
import { FilaDetalleFactura } from '@/componentes/dominio/ventas/fila-detalle-factura';
import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/componentes/ui/table';
import { COLUMNAS_ANTES_DEL_TOTAL } from '@/constantes/interfaz';
import { formatearMoneda } from '@/lib/formato';
import type { Factura } from '@/servicios/facturas';

export function TablaDetalleFactura({ factura }: { factura: Factura }) {
  return (
    <MarcoTabla>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-right">Cantidad</TableHead>
          <TableHead className="text-right">Precio</TableHead>
          <TableHead className="text-right">Subtotal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {factura.items.map((renglon) => (
          <FilaDetalleFactura key={renglon.productoId} renglon={renglon} />
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell
            colSpan={COLUMNAS_ANTES_DEL_TOTAL}
            className="text-right font-semibold"
          >
            Total
          </TableCell>
          <TableCell className="text-right text-base font-semibold tabular-nums">
            {formatearMoneda(factura.total)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </MarcoTabla>
  );
}
