import Link from 'next/link';
import { InsigniaActivo } from '@/componentes/comunes/insignia-activo';
import { TableCell, TableRow } from '@/componentes/ui/table';
import { RUTAS } from '@/constantes/rutas';
import { formatearMoneda } from '@/lib/formato';
import type { Cliente } from '@/servicios/clientes';

export function FilaCliente({ cliente }: { cliente: Cliente }) {
  return (
    <TableRow>
      <TableCell className="max-w-64">
        <Link
          href={RUTAS.cliente(cliente.id)}
          className="block truncate font-medium hover:underline"
        >
          {cliente.nombre}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground tabular-nums">
        {cliente.tipoDoc} {cliente.nroDoc}
      </TableCell>
      <TableCell className="hidden text-muted-foreground md:table-cell">
        {cliente.telefono}
      </TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {formatearMoneda(cliente.saldo)}
      </TableCell>
      <TableCell>
        <InsigniaActivo activo={cliente.activo} />
      </TableCell>
    </TableRow>
  );
}
