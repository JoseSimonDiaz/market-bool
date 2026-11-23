'use client';

import { useCallback } from 'react';
import {
  MarcoCampo,
  usePropsAccesiblesDelCampo,
} from '@/componentes/comunes/campos/marco-campo';
import { aOpcionesDeSelect, type Opcion } from '@/lib/opciones';
import { SelectorOpciones } from '@/componentes/comunes/selector-opciones';
import { PLACEHOLDER_SELECCION } from '@/constantes/interfaz';
import { useCampoActual } from '@/hooks/formulario/contexto';

export function CampoSeleccion({
  etiqueta,
  opciones,
}: {
  etiqueta: string;
  opciones: Opcion[];
}) {
  const campo = useCampoActual<string>();
  const { id, 'aria-invalid': invalido } = usePropsAccesiblesDelCampo();
  const elegirOpcion = useCallback(
    (valorElegido: string | null) => campo.handleChange(valorElegido ?? ''),
    [campo]
  );

  return (
    <MarcoCampo etiqueta={etiqueta}>
      <SelectorOpciones
        id={id}
        opcionesDelSelect={aOpcionesDeSelect(opciones)}
        valorSeleccionado={campo.state.value || null}
        alCambiar={elegirOpcion}
        placeholder={PLACEHOLDER_SELECCION}
        invalido={invalido}
      />
    </MarcoCampo>
  );
}
