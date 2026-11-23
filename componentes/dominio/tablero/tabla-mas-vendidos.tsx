import { EstadoVacio } from '@/componentes/comunes/estados';
import { MarcoTabla } from '@/componentes/comunes/marco-tabla';
import {
  FilaMasVendido,
  type ProductoMasVendido,
} from '@/componentes/dominio/tablero/fila-mas-vendido';
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/componentes/ui/table';

export function TablaMasVendidos({
  productos,
}: {
  productos: ProductoMasVendido[];
}) {
  if (productos.length === 0) {
    return <EstadoVacio mensaje="Todavía no hay ventas este mes." />;
  }
  return (
    <MarcoTabla>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden sm:table-cell">Código</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-right">Unidades</TableHead>
          <TableHead className="hidden text-right sm:table-cell">
            Importe
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productos.map((producto) => (
          <FilaMasVendido key={producto.productoId} producto={producto} />
        ))}
      </TableBody>
    </MarcoTabla>
  );
}
