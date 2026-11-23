import { EstadoVacio } from '@/componentes/comunes/estados';
import { MarcoTabla } from '@/componentes/comunes/marco-tabla';
import { FilaCliente } from '@/componentes/dominio/clientes/fila-cliente';
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/componentes/ui/table';
import type { Cliente } from '@/servicios/clientes';

export function TablaClientes({ clientes }: { clientes: Cliente[] }) {
  if (clientes.length === 0) {
    return (
      <EstadoVacio mensaje="No hay clientes que coincidan con el filtro." />
    );
  }
  return (
    <MarcoTabla>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead className="hidden md:table-cell">Teléfono</TableHead>
          <TableHead className="text-right">Saldo</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente) => (
          <FilaCliente key={cliente.id} cliente={cliente} />
        ))}
      </TableBody>
    </MarcoTabla>
  );
}
