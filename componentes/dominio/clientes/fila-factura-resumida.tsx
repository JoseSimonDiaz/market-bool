import Link from 'next/link';
import { InsigniaEstadoFactura } from '@/componentes/dominio/ventas/insignia-estado-factura';
import { TableCell, TableRow } from '@/componentes/ui/table';
import { ETIQUETA_FORMA_PAGO } from '@/constantes/etiquetas';
import { RUTAS } from '@/constantes/rutas';
import { formatearFechaHora, formatearMoneda } from '@/lib/formato';
import type { FichaDeCliente } from '@/servicios/clientes';

export type FacturaResumida = FichaDeCliente['ultimasFacturas'][number];

export function FilaFacturaResumida({ factura }: { factura: FacturaResumida }) {
  return (
    <TableRow>
      <TableCell>
        <Link
          href={RUTAS.venta(factura.id)}
          className="font-mono text-xs font-medium hover:underline"
        >
          {factura.numero}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatearFechaHora(factura.fecha)}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {ETIQUETA_FORMA_PAGO[factura.formaPago]}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatearMoneda(factura.total)}
      </TableCell>
      <TableCell>
        <InsigniaEstadoFactura estado={factura.estado} />
      </TableCell>
    </TableRow>
  );
}
