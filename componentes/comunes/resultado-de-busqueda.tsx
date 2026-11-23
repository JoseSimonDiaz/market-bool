'use client';

import { useCallback } from 'react';

export type DescripcionDeResultado = {
  clave: number;
  titulo: string;
  detalle: string;
  elegible: boolean;
};

export function ResultadoDeBusqueda<Resultado>({
  resultado,
  descripcion,
  alElegir,
}: {
  resultado: Resultado;
  descripcion: DescripcionDeResultado;
  alElegir: (resultado: Resultado) => void;
}) {
  const elegir = useCallback(() => alElegir(resultado), [alElegir, resultado]);

  return (
    <button
      type="button"
      disabled={!descripcion.elegible}
      onClick={elegir}
      className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="font-medium">{descripcion.titulo}</span>
      <span className="text-xs text-muted-foreground">
        {descripcion.detalle}
      </span>
    </button>
  );
}
