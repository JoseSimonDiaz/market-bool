import { InboxIcon } from 'lucide-react';
import { Skeleton } from '@/componentes/ui/skeleton';

export function EstadoVacio({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-center">
      <InboxIcon className="size-8 text-muted-foreground" aria-hidden />
      <p className="text-sm text-muted-foreground">{mensaje}</p>
    </div>
  );
}

export function EsqueletoListado({ filas = 6 }: { filas?: number }) {
  return (
    <div className="flex flex-col gap-4" aria-busy aria-live="polite">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-9 w-full max-w-md" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: filas }, (_valor, indice) => (
          <Skeleton key={indice} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
