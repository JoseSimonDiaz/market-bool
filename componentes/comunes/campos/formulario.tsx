'use client';

import { useCallback, type FormEvent, type ReactNode } from 'react';
import { useFormularioActual } from '@/hooks/formulario/contexto';

export function Formulario({ children }: { children: ReactNode }) {
  const formulario = useFormularioActual();
  const enviarFormulario = useCallback(
    (evento: FormEvent) => {
      evento.preventDefault();
      formulario.handleSubmit();
    },
    [formulario]
  );

  return (
    <form
      noValidate
      onSubmit={enviarFormulario}
      className="flex flex-col gap-4"
    >
      {children}
    </form>
  );
}
