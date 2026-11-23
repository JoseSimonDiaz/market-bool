'use client';

import { useCallback, type ChangeEvent } from 'react';
import {
  MarcoCampo,
  usePropsAccesiblesDelCampo,
} from '@/componentes/comunes/campos/marco-campo';
import { Input } from '@/componentes/ui/input';
import { PASO_ENTERO, VALOR_MINIMO_ENTERO } from '@/constantes/interfaz';
import { useCampoActual } from '@/hooks/formulario/contexto';

function textoANumero(texto: string) {
  if (!texto) return Number.NaN;
  return Number(texto);
}

function numeroATexto(numero: number | undefined) {
  if (!Number.isFinite(numero)) return '';
  return String(numero);
}

export function CampoEntero({
  etiqueta,
  ayuda,
}: {
  etiqueta: string;
  ayuda?: string;
}) {
  const campo = useCampoActual<number | undefined>();
  const propsAccesibles = usePropsAccesiblesDelCampo();
  const cambiarNumero = useCallback(
    (evento: ChangeEvent<HTMLInputElement>) =>
      campo.handleChange(textoANumero(evento.target.value)),
    [campo]
  );

  return (
    <MarcoCampo etiqueta={etiqueta} ayuda={ayuda}>
      <Input
        {...propsAccesibles}
        type="number"
        inputMode="numeric"
        min={VALOR_MINIMO_ENTERO}
        step={PASO_ENTERO}
        value={numeroATexto(campo.state.value)}
        onChange={cambiarNumero}
        onBlur={campo.handleBlur}
      />
    </MarcoCampo>
  );
}
