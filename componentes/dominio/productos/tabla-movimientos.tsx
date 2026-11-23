import { EstadoVacio } from '@/componentes/comunes/estados';
import { MarcoTabla } from '@/componentes/comunes/marco-tabla';
import { FilaMovimiento } from '@/componentes/dominio/productos/fila-movimiento';
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/componentes/ui/table';
import type { MovimientoStock } from '@/servicios/stock';

export function TablaMovimientos({
  movimientos,
  mostrarProducto,
}: {
  movimientos: MovimientoStock[];
  mostrarProducto: boolean;
}) {
  if (movimientos.length === 0) {
    return <EstadoVacio mensaje="No hay movimientos para mostrar." />;
  }
  return (
    <MarcoTabla>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          {mostrarProducto && <TableHead>Producto</TableHead>}
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Cantidad</TableHead>
          <TableHead className="text-right">Resultante</TableHead>
          <TableHead className="hidden md:table-cell">Motivo</TableHead>
          <TableHead className="hidden lg:table-cell">Usuario</TableHead>
          <TableHead className="hidden sm:table-cell">Referencia</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movimientos.map((movimiento) => (
          <FilaMovimiento
            key={movimiento.id}
            movimiento={movimiento}
            mostrarProducto={mostrarProducto}
          />
        ))}
      </TableBody>
    </MarcoTabla>
  );
}
