import Link from 'next/link';
import { TableCell, TableRow } from '@/componentes/ui/table';
import { MOVIMIENTO_CUENTA } from '@/constantes/dominio';
import { SIN_REFERENCIA } from '@/constantes/interfaz';
import { RUTAS } from '@/constantes/rutas';
import { formatearFechaHora, formatearMoneda } from '@/lib/formato';
import type { CuentaCorriente } from '@/servicios/cuenta-corriente';

type MovimientoDeCuenta = CuentaCorriente['movimientos'][number];

function DescripcionMovimiento({
  movimiento,
}: {
  movimiento: MovimientoDeCuenta;
}) {
  if (!movimiento.pagoId) return movimiento.descripcion;
  return (
    <Link href={RUTAS.recibo(movimiento.pagoId)} className="hover:underline">
      {movimiento.descripcion}
    </Link>
  );
}

export function FilaMovimientoCuenta({
  movimiento,
}: {
  movimiento: MovimientoDeCuenta;
}) {
  const importe = formatearMoneda(movimiento.importe);
  const esDebito = movimiento.tipo === MOVIMIENTO_CUENTA.debito;
  const debito = esDebito ? importe : SIN_REFERENCIA;
  const credito = esDebito ? SIN_REFERENCIA : importe;

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">
        {formatearFechaHora(movimiento.fecha)}
      </TableCell>
      <TableCell>
        <DescripcionMovimiento movimiento={movimiento} />
      </TableCell>
      <TableCell className="text-right tabular-nums">{debito}</TableCell>
      <TableCell className="text-right tabular-nums">{credito}</TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {formatearMoneda(movimiento.saldo)}
      </TableCell>
    </TableRow>
  );
}
