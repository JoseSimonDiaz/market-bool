import Link from 'next/link';
import { InsigniaEstadoFactura } from '@/componentes/dominio/ventas/insignia-estado-factura';
import { TableCell, TableRow } from '@/componentes/ui/table';
import {
  ETIQUETA_FORMA_PAGO,
  TEXTO_CONSUMIDOR_FINAL,
} from '@/constantes/etiquetas';
import { RUTAS } from '@/constantes/rutas';
import { formatearFechaHora, formatearMoneda } from '@/lib/formato';
import type { FacturaDelListado } from '@/servicios/facturas';

export function FilaFactura({ factura }: { factura: FacturaDelListado }) {
  const comprador = factura.cliente?.nombre ?? TEXTO_CONSUMIDOR_FINAL;

  return (
    <TableRow>
      <TableCell>
        <Link
          href={RUTAS.venta(factura.id)}
          className="font-mono text-xs font-medium hover:underline"
        >
          {factura.numeroFormateado}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatearFechaHora(factura.fecha)}
      </TableCell>
      <TableCell className="max-w-48 truncate">{comprador}</TableCell>
      <TableCell className="hidden text-muted-foreground lg:table-cell">
        {factura.vendedor.nombre}
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
