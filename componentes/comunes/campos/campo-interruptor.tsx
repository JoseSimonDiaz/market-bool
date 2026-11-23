'use client';

import { useCallback } from 'react';
import { usePropsAccesiblesDelCampo } from '@/componentes/comunes/campos/marco-campo';
import { Label } from '@/componentes/ui/label';
import { Switch } from '@/componentes/ui/switch';
import { useCampoActual } from '@/hooks/formulario/contexto';

export function CampoInterruptor({
  etiqueta,
  ayuda,
}: {
  etiqueta: string;
  ayuda?: string;
}) {
  const campo = useCampoActual<boolean>();
  const propsAccesibles = usePropsAccesiblesDelCampo();
  const cambiarValor = useCallback(
    (encendido: boolean) => campo.handleChange(encendido),
    [campo]
  );

  return (
    <div className="flex items-start gap-3">
      <Switch
        {...propsAccesibles}
        checked={campo.state.value}
        onCheckedChange={cambiarValor}
      />
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={campo.name}>{etiqueta}</Label>
        {ayuda && <p className="text-xs text-muted-foreground">{ayuda}</p>}
      </div>
    </div>
  );
}
