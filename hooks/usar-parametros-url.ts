'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { PARAMETRO_URL } from '@/constantes/url';

export function useCambiarParametroUrl() {
  const enrutador = useRouter();
  const rutaActual = usePathname();
  const parametrosActuales = useSearchParams();

  return useCallback(
    (parametro: string, valorNuevo: string) => {
      const parametrosNuevos = new URLSearchParams(parametrosActuales);
      if (valorNuevo) parametrosNuevos.set(parametro, valorNuevo);
      else parametrosNuevos.delete(parametro);
      parametrosNuevos.delete(PARAMETRO_URL.pagina);
      enrutador.replace(`${rutaActual}?${parametrosNuevos}`);
    },
    [enrutador, rutaActual, parametrosActuales]
  );
}

export function useEnlaceAPagina() {
  const rutaActual = usePathname();
  const parametrosActuales = useSearchParams();

  return useCallback(
    (pagina: number) => {
      const parametrosNuevos = new URLSearchParams(parametrosActuales);
      parametrosNuevos.set(PARAMETRO_URL.pagina, String(pagina));
      return `${rutaActual}?${parametrosNuevos}`;
    },
    [rutaActual, parametrosActuales]
  );
}
