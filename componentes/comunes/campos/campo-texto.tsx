'use client';

import { useCallback, type ChangeEvent } from 'react';
import {
  MarcoCampo,
  usePropsAccesiblesDelCampo,
} from '@/componentes/comunes/campos/marco-campo';
import { Input } from '@/componentes/ui/input';
import { useCampoActual } from '@/hooks/formulario/contexto';

type TipoCampoTexto = 'text' | 'email' | 'password';

export function CampoTexto({
  etiqueta,
  tipo = 'text',
  ayuda,
  autoComplete,
  placeholder,
}: {
  etiqueta: string;
  tipo?: TipoCampoTexto;
  ayuda?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const campo = useCampoActual<string>();
  const propsAccesibles = usePropsAccesiblesDelCampo();
  const cambiarTexto = useCallback(
    (evento: ChangeEvent<HTMLInputElement>) =>
      campo.handleChange(evento.target.value),
    [campo]
  );

  return (
    <MarcoCampo etiqueta={etiqueta} ayuda={ayuda}>
      <Input
        {...propsAccesibles}
        type={tipo}
        value={campo.state.value}
        onChange={cambiarTexto}
        onBlur={campo.handleBlur}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
    </MarcoCampo>
  );
}
