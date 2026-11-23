'use client';

import { useCallback, useState, type ChangeEvent } from 'react';
import {
  MarcoCampo,
  usePropsAccesiblesDelCampo,
} from '@/componentes/comunes/campos/marco-campo';
import { Input } from '@/componentes/ui/input';
import { useCampoActual } from '@/hooks/formulario/contexto';
import { centavosAPesos, pesosACentavos } from '@/lib/formato';

function centavosATextoEditable(centavos: number | undefined) {
  if (!Number.isFinite(centavos)) return '';
  return centavosAPesos(Number(centavos));
}

export function CampoImporte({
  etiqueta,
  ayuda,
}: {
  etiqueta: string;
  ayuda?: string;
}) {
  const campo = useCampoActual<number | undefined>();
  const propsAccesibles = usePropsAccesiblesDelCampo();
  const [textoEnPesos, setTextoEnPesos] = useState(
    centavosATextoEditable(campo.state.value)
  );
  const cambiarImporte = useCallback(
    (evento: ChangeEvent<HTMLInputElement>) => {
      setTextoEnPesos(evento.target.value);
      campo.handleChange(pesosACentavos(evento.target.value));
    },
    [campo]
  );

  return (
    <MarcoCampo etiqueta={etiqueta} ayuda={ayuda}>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
          $
        </span>
        <Input
          {...propsAccesibles}
          className="pl-6"
          inputMode="decimal"
          placeholder="0,00"
          value={textoEnPesos}
          onChange={cambiarImporte}
          onBlur={campo.handleBlur}
        />
      </div>
    </MarcoCampo>
  );
}
