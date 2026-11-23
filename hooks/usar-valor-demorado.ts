'use client';

import { useEffect, useState } from 'react';
import { ESPERA_BUSQUEDA_MS } from '@/constantes/url';

export function useValorDemorado<Valor>(valorActual: Valor) {
  const [valorDemorado, setValorDemorado] = useState(valorActual);

  useEffect(() => {
    const temporizador = setTimeout(
      () => setValorDemorado(valorActual),
      ESPERA_BUSQUEDA_MS
    );
    return () => clearTimeout(temporizador);
  }, [valorActual]);

  return valorDemorado;
}
