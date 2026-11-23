'use client';

import { useStore } from '@tanstack/react-form';
import { Loader2Icon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/componentes/ui/button';
import { useFormularioActual } from '@/hooks/formulario/contexto';

export function BotonEnviar({ children }: { children: ReactNode }) {
  const formulario = useFormularioActual();
  const enviando = useStore(
    formulario.store,
    (estadoFormulario) => estadoFormulario.isSubmitting
  );

  return (
    <Button type="submit" disabled={enviando}>
      {enviando && <Loader2Icon className="animate-spin" />}
      {children}
    </Button>
  );
}
