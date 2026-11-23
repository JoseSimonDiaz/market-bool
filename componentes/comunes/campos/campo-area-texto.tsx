'use client';

import { useCallback, type ChangeEvent } from 'react';
import {
  MarcoCampo,
  usePropsAccesiblesDelCampo,
} from '@/componentes/comunes/campos/marco-campo';
import { Textarea } from '@/componentes/ui/textarea';
import { useCampoActual } from '@/hooks/formulario/contexto';

export function CampoAreaTexto({ etiqueta }: { etiqueta: string }) {
  const campo = useCampoActual<string | null | undefined>();
  const propsAccesibles = usePropsAccesiblesDelCampo();
  const cambiarTexto = useCallback(
    (evento: ChangeEvent<HTMLTextAreaElement>) =>
      campo.handleChange(evento.target.value),
    [campo]
  );

  return (
    <MarcoCampo etiqueta={etiqueta}>
      <Textarea
        {...propsAccesibles}
        value={campo.state.value ?? ''}
        onChange={cambiarTexto}
        onBlur={campo.handleBlur}
      />
    </MarcoCampo>
  );
}
