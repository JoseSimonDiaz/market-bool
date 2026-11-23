import Link from 'next/link';
import { EstadoVacio } from '@/componentes/comunes/estados';
import { InsigniaActivo } from '@/componentes/comunes/insignia-activo';
import { MarcoTabla } from '@/componentes/comunes/marco-tabla';
import { InsigniaBajoMinimo } from '@/componentes/dominio/productos/insignia-bajo-minimo';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/componentes/ui/table';
import { RUTAS } from '@/constantes/rutas';
import { formatearEntero, formatearMoneda } from '@/lib/formato';
import type { Producto } from '@/servicios/productos';

function FilaProducto({
  producto,
  mostrarEstado,
}: {
  producto: Producto;
  mostrarEstado: boolean;
}) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{producto.codigo}</TableCell>
      <TableCell className="max-w-64">
        <Link
          href={RUTAS.producto(producto.id)}
          className="block truncate font-medium hover:underline"
        >
          {producto.descripcion}
        </Link>
      </TableCell>
      <TableCell className="hidden text-muted-foreground md:table-cell">
        {producto.categoria.nombre}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatearMoneda(producto.precio)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        <span className="inline-flex items-center gap-2">
          {producto.bajoMinimo && <InsigniaBajoMinimo />}
          {formatearEntero(producto.existencia)}
        </span>
      </TableCell>
      {mostrarEstado && (
        <TableCell>
          <InsigniaActivo activo={producto.activo} />
        </TableCell>
      )}
    </TableRow>
  );
}

export function TablaProductos({
  productos,
  mostrarEstado,
}: {
  productos: Producto[];
  mostrarEstado: boolean;
}) {
  if (productos.length === 0) {
    return (
      <EstadoVacio mensaje="No hay productos que coincidan con el filtro." />
    );
  }
  return (
    <MarcoTabla>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="hidden md:table-cell">Categoría</TableHead>
          <TableHead className="text-right">Precio</TableHead>
          <TableHead className="text-right">Existencia</TableHead>
          {mostrarEstado && <TableHead>Estado</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {productos.map((producto) => (
          <FilaProducto
            key={producto.id}
            producto={producto}
            mostrarEstado={mostrarEstado}
          />
        ))}
      </TableBody>
    </MarcoTabla>
  );
}
