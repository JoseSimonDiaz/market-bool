'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { aOpcionesDeSelect, type Opcion } from '@/lib/opciones';
import { SelectorOpciones } from '@/componentes/comunes/selector-opciones';
import { SIN_FILTRO } from '@/constantes/url';
import { useCambiarParametroUrl } from '@/hooks/usar-parametros-url';

export function FiltroUrl({
  parametro,
  opciones,
  etiquetaSinFiltro,
}: {
  parametro: string;
  opciones: Opcion<string | number>[];
  etiquetaSinFiltro: string;
}) {
  const cambiarParametro = useCambiarParametroUrl();
  const valorEnUrl = useSearchParams().get(parametro) ?? SIN_FILTRO;
  const opcionesDelSelect = [
    { value: SIN_FILTRO, label: etiquetaSinFiltro },
    ...aOpcionesDeSelect(opciones),
  ];
  const elegirFiltro = useCallback(
    (valorElegido: string | null) => {
      const quitarFiltro = !valorElegido || valorElegido === SIN_FILTRO;
      cambiarParametro(parametro, quitarFiltro ? '' : valorElegido);
    },
    [cambiarParametro, parametro]
  );

  return (
    <SelectorOpciones
      opcionesDelSelect={opcionesDelSelect}
      valorSeleccionado={valorEnUrl}
      alCambiar={elegirFiltro}
      etiquetaAccesible={etiquetaSinFiltro}
      className="sm:w-48"
    />
  );
}
