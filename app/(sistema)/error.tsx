'use client';

import { TriangleAlertIcon } from 'lucide-react';
import { Pila, Texto, Titulo } from '@/componentes/primitivas';
import { Button } from '@/componentes/ui/button';

export default function ErrorDePagina({
  retry: reintentar,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <Pila className="items-center py-16 text-center">
      <TriangleAlertIcon className="size-10 text-destructive" aria-hidden />
      <Titulo nivel={2}>No pudimos cargar esta página</Titulo>
      <Texto tono="suave">
        Probá de nuevo en unos segundos. Si el problema sigue, avisá al
        administrador.
      </Texto>
      <Button onClick={reintentar}>Reintentar</Button>
    </Pila>
  );
}
