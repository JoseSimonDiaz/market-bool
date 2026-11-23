'use client';

import { PrinterIcon } from 'lucide-react';
import { useCallback } from 'react';
import { BotonConIcono } from '@/componentes/comunes/boton-icono';

export function BotonImprimir() {
  const imprimir = useCallback(() => window.print(), []);
  return (
    <BotonConIcono
      icono={PrinterIcon}
      etiqueta="Imprimir"
      variant="default"
      onClick={imprimir}
    />
  );
}
