import { EstadoVacio } from '@/componentes/comunes/estados';
import { MarcoTabla } from '@/componentes/comunes/marco-tabla';
import {
  FilaFacturaResumida,
  type FacturaResumida,
} from '@/componentes/dominio/clientes/fila-factura-resumida';
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/componentes/ui/table';

export function TablaUltimasFacturas({
  facturas,
}: {
  facturas: FacturaResumida[];
}) {
  if (facturas.length === 0) {
    return <EstadoVacio mensaje="Todavía no tiene facturas." />;
  }
  return (
    <MarcoTabla>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead className="hidden md:table-cell">Forma de pago</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {facturas.map((factura) => (
          <FilaFacturaResumida key={factura.id} factura={factura} />
        ))}
      </TableBody>
    </MarcoTabla>
  );
}
