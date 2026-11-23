import { TableCell, TableRow } from '@/componentes/ui/table';
import { formatearEntero, formatearMoneda } from '@/lib/formato';
import type { Factura } from '@/servicios/facturas';

type RenglonDeFactura = Factura['items'][number];

export function FilaDetalleFactura({ renglon }: { renglon: RenglonDeFactura }) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{renglon.codigo}</TableCell>
      <TableCell>{renglon.descripcion}</TableCell>
      <TableCell className="text-right tabular-nums">
        {formatearEntero(renglon.cantidad)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatearMoneda(renglon.precioUnitario)}
      </TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {formatearMoneda(renglon.subtotal)}
      </TableCell>
    </TableRow>
  );
}
