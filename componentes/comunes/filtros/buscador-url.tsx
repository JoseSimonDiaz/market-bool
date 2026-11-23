'use client';

import { SearchIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { Input } from '@/componentes/ui/input';
import { ESPERA_BUSQUEDA_MS, PARAMETRO_URL } from '@/constantes/url';
import { useCambiarParametroUrl } from '@/hooks/usar-parametros-url';

export function BuscadorUrl({ placeholder }: { placeholder: string }) {
  const cambiarParametro = useCambiarParametroUrl();
  const busquedaEnUrl = useSearchParams().get(PARAMETRO_URL.busqueda) ?? '';
  const [textoBuscado, setTextoBuscado] = useState(busquedaEnUrl);

  useEffect(() => {
    if (textoBuscado === busquedaEnUrl) return;
    const temporizador = setTimeout(
      () => cambiarParametro(PARAMETRO_URL.busqueda, textoBuscado.trim()),
      ESPERA_BUSQUEDA_MS
    );
    return () => clearTimeout(temporizador);
  }, [textoBuscado]);

  const escribir = useCallback(
    (evento: ChangeEvent<HTMLInputElement>) =>
      setTextoBuscado(evento.target.value),
    []
  );

  return (
    <div className="relative w-full sm:max-w-xs">
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        className="pl-8"
        value={textoBuscado}
        onChange={escribir}
      />
    </div>
  );
}
