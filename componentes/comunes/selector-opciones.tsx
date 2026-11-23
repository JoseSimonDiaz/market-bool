'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/componentes/ui/select';
import { combinarClases } from '@/lib/utils';

export type OpcionDeSelect = { value: string; label: string };

type PropsSelectorOpciones = {
  id?: string;
  opcionesDelSelect: OpcionDeSelect[];
  valorSeleccionado: string | null;
  alCambiar: (valorElegido: string | null) => void;
  placeholder?: string;
  etiquetaAccesible?: string;
  invalido?: boolean;
  className?: string;
};

function ListaDeOpciones({ opciones }: { opciones: OpcionDeSelect[] }) {
  return (
    <SelectContent>
      {opciones.map((opcionDeSelect) => (
        <SelectItem key={opcionDeSelect.value} value={opcionDeSelect.value}>
          {opcionDeSelect.label}
        </SelectItem>
      ))}
    </SelectContent>
  );
}

export function SelectorOpciones(props: PropsSelectorOpciones) {
  const { opcionesDelSelect, valorSeleccionado, alCambiar } = props;
  return (
    <Select
      items={opcionesDelSelect}
      value={valorSeleccionado}
      onValueChange={alCambiar}
    >
      <SelectTrigger
        id={props.id}
        className={combinarClases('w-full', props.className)}
        aria-label={props.etiquetaAccesible}
        aria-invalid={props.invalido}
      >
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <ListaDeOpciones opciones={opcionesDelSelect} />
    </Select>
  );
}
