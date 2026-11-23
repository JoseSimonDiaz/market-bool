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

function numeroASeleccion(numero: number | undefined) {
  if (!Number.isFinite(numero)) return null;
  return String(numero);
}

export function CampoSeleccionNumerica({
  etiqueta,
  opciones,
}: {
  etiqueta: string;
  opciones: Opcion<number>[];
}) {
  const campo = useCampoActual<number | undefined>();
  const { id, 'aria-invalid': invalido } = usePropsAccesiblesDelCampo();
  const elegirOpcion = useCallback(
    (valorElegido: string | null) => campo.handleChange(Number(valorElegido)),
    [campo]
  );

  return (
    <MarcoCampo etiqueta={etiqueta}>
      <SelectorOpciones
        id={id}
        opcionesDelSelect={aOpcionesDeSelect(opciones)}
        valorSeleccionado={numeroASeleccion(campo.state.value)}
        alCambiar={elegirOpcion}
        placeholder={PLACEHOLDER_SELECCION}
        invalido={invalido}
      />
    </MarcoCampo>
  );
}
