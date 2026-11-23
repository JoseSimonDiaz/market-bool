import Link from 'next/link';
import { Badge } from '@/componentes/ui/badge';
import { TableCell, TableRow } from '@/componentes/ui/table';
import { ETIQUETA_MOVIMIENTO_STOCK } from '@/constantes/etiquetas';
import { COLOR_CANTIDAD } from '@/constantes/estilos';
import { SIGNO_POSITIVO, SIN_REFERENCIA } from '@/constantes/interfaz';
import { RUTAS } from '@/constantes/rutas';
import {
  formatearEntero,
  formatearFechaHora,
  formatearNumeroComprobante,
} from '@/lib/formato';
import { combinarClases } from '@/lib/utils';
import type { MovimientoStock } from '@/servicios/stock';

function CantidadMovida({ cantidad }: { cantidad: number }) {
  const esSalida = cantidad < 0;
  const signo = esSalida ? '' : SIGNO_POSITIVO;
  const color = esSalida ? COLOR_CANTIDAD.salida : COLOR_CANTIDAD.entrada;
  return (
    <TableCell
      className={combinarClases('text-right font-medium tabular-nums', color)}
    >
      {signo}
      {formatearEntero(cantidad)}
    </TableCell>
  );
}

function ReferenciaFactura({
  referencia,
}: {
  referencia: MovimientoStock['referencia'];
}) {
  const numeroFactura = referencia
    ? formatearNumeroComprobante(referencia.puntoVenta, referencia.numero)
    : SIN_REFERENCIA;
  return (
    <TableCell className="hidden font-mono text-xs sm:table-cell">
      {numeroFactura}
    </TableCell>
  );
}

function CeldaProducto({
  producto,
}: {
  producto: MovimientoStock['producto'];
}) {
  return (
    <TableCell>
      <Link
        href={RUTAS.producto(producto.id)}
        className="font-mono text-xs hover:underline"
      >
        {producto.codigo}
      </Link>
    </TableCell>
  );
}

function CeldaMotivo({ motivo, observacion }: MovimientoStock) {
  return (
    <TableCell className="hidden md:table-cell">
      {motivo}
      {observacion && (
        <span className="block text-xs text-muted-foreground">
          {observacion}
        </span>
      )}
    </TableCell>
  );
}

export function FilaMovimiento({
  movimiento,
  mostrarProducto,
}: {
  movimiento: MovimientoStock;
  mostrarProducto: boolean;
}) {
  return (
    <TableRow>
      <TableCell className="whitespace-nowrap tabular-nums">
        {formatearFechaHora(movimiento.fecha)}
      </TableCell>
      {mostrarProducto && <CeldaProducto producto={movimiento.producto} />}
      <TableCell>
        <Badge variant="outline">
          {ETIQUETA_MOVIMIENTO_STOCK[movimiento.tipo]}
        </Badge>
      </TableCell>
      <CantidadMovida cantidad={movimiento.cantidad} />
      <TableCell className="text-right tabular-nums">
        {formatearEntero(movimiento.existenciaResultante)}
      </TableCell>
      <CeldaMotivo {...movimiento} />
      <TableCell className="hidden lg:table-cell">
        {movimiento.usuario.nombre}
      </TableCell>
      <ReferenciaFactura referencia={movimiento.referencia} />
    </TableRow>
  );
}
