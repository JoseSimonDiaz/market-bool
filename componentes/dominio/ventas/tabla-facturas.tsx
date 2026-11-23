import { EstadoVacio } from '@/componentes/comunes/estados';
import { MarcoTabla } from '@/componentes/comunes/marco-tabla';
import { FilaFactura } from '@/componentes/dominio/ventas/fila-factura';
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/componentes/ui/table';
import type { FacturaDelListado } from '@/servicios/facturas';

export function TablaFacturas({ facturas }: { facturas: FacturaDelListado[] }) {
  if (facturas.length === 0) {
    return (
      <EstadoVacio mensaje="No hay facturas que coincidan con el filtro." />
    );
  }
  return (
    <MarcoTabla>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Comprador</TableHead>
          <TableHead className="hidden lg:table-cell">Vendedor</TableHead>
          <TableHead className="hidden md:table-cell">Forma de pago</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {facturas.map((factura) => (
          <FilaFactura key={factura.id} factura={factura} />
        ))}
      </TableBody>
    </MarcoTabla>
  );
}
