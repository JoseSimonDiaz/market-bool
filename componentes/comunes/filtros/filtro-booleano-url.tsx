'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Label } from '@/componentes/ui/label';
import { Switch } from '@/componentes/ui/switch';
import { booleanoDeUrl } from '@/esquemas/comunes';
import { useCambiarParametroUrl } from '@/hooks/usar-parametros-url';

const leerBooleanoDeUrl = booleanoDeUrl.catch(false);

export function FiltroBooleanoUrl({
  parametro,
  etiqueta,
}: {
  parametro: string;
  etiqueta: string;
}) {
  const cambiarParametro = useCambiarParametroUrl();
  const activado = leerBooleanoDeUrl.parse(useSearchParams().get(parametro));
  const alternar = useCallback(
    (activar: boolean) =>
      cambiarParametro(parametro, activar ? String(activar) : ''),
    [cambiarParametro, parametro]
  );

  return (
    <div className="flex items-center gap-2">
      <Switch id={parametro} checked={activado} onCheckedChange={alternar} />
      <Label htmlFor={parametro}>{etiqueta}</Label>
    </div>
  );
}
