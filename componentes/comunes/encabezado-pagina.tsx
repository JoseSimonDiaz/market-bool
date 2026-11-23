import type { ReactNode } from 'react';
import { Texto, Titulo } from '@/componentes/primitivas';

export function EncabezadoPagina({
  titulo,
  descripcion,
  acciones,
}: {
  titulo: string;
  descripcion?: ReactNode;
  acciones?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <Titulo>{titulo}</Titulo>
        {descripcion && <Texto tono="suave">{descripcion}</Texto>}
      </div>
      {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
    </header>
  );
}
