import { EstadoVacio } from '@/componentes/comunes/estados';
import { InsigniaActivo } from '@/componentes/comunes/insignia-activo';
import { MarcoTabla } from '@/componentes/comunes/marco-tabla';
import { AccionesCategoria } from '@/componentes/dominio/productos/categorias/acciones-categoria';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/componentes/ui/table';
import { formatearEntero } from '@/lib/formato';
import type { Categoria } from '@/servicios/categorias';

function FilaCategoria({
  categoria,
  mostrarAcciones,
}: {
  categoria: Categoria;
  mostrarAcciones: boolean;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{categoria.nombre}</TableCell>
      <TableCell className="text-right tabular-nums">
        {formatearEntero(categoria.productosActivos)}
      </TableCell>
      <TableCell>
        <InsigniaActivo activo={categoria.activa} />
      </TableCell>
      {mostrarAcciones && (
        <TableCell>
          <AccionesCategoria categoria={categoria} />
        </TableCell>
      )}
    </TableRow>
  );
}

export function TablaCategorias({
  categorias,
  mostrarAcciones,
}: {
  categorias: Categoria[];
  mostrarAcciones: boolean;
}) {
  if (categorias.length === 0) {
    return <EstadoVacio mensaje="Todavía no hay categorías." />;
  }
  return (
    <MarcoTabla>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead className="text-right">Productos activos</TableHead>
          <TableHead>Estado</TableHead>
          {mostrarAcciones && (
            <TableHead className="text-right">Acciones</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {categorias.map((categoria) => (
          <FilaCategoria
            key={categoria.id}
            categoria={categoria}
            mostrarAcciones={mostrarAcciones}
          />
        ))}
      </TableBody>
    </MarcoTabla>
  );
}
