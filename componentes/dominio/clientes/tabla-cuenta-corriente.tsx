import { EstadoVacio } from '@/componentes/comunes/estados';
import { MarcoTabla } from '@/componentes/comunes/marco-tabla';
import { FilaMovimientoCuenta } from '@/componentes/dominio/clientes/fila-movimiento-cuenta';
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/componentes/ui/table';
import type { CuentaCorriente } from '@/servicios/cuenta-corriente';

export function TablaCuentaCorriente({ cuenta }: { cuenta: CuentaCorriente }) {
  if (cuenta.movimientos.length === 0) {
    return <EstadoVacio mensaje="La cuenta corriente no tiene movimientos." />;
  }
  return (
    <MarcoTabla>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-right">Débito</TableHead>
          <TableHead className="text-right">Crédito</TableHead>
          <TableHead className="text-right">Saldo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cuenta.movimientos.map((movimiento, posicion) => (
          <FilaMovimientoCuenta key={posicion} movimiento={movimiento} />
        ))}
      </TableBody>
    </MarcoTabla>
  );
}
