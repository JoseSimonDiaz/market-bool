'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, type ChangeEvent } from 'react';
import { Input } from '@/componentes/ui/input';
import { useCambiarParametroUrl } from '@/hooks/usar-parametros-url';

export function FiltroFechaUrl({
  parametro,
  etiqueta,
}: {
  parametro: string;
  etiqueta: string;
}) {
  const cambiarParametro = useCambiarParametroUrl();
  const diaEnUrl = useSearchParams().get(parametro) ?? '';
  const elegirDia = useCallback(
    (evento: ChangeEvent<HTMLInputElement>) =>
      cambiarParametro(parametro, evento.target.value),
    [cambiarParametro, parametro]
  );

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      {etiqueta}
      <Input
        type="date"
        className="w-auto"
        value={diaEnUrl}
        onChange={elegirDia}
      />
    </label>
  );
}
