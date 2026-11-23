'use client';

import { SearchIcon } from 'lucide-react';
import {
  useCallback,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import {
  ResultadoDeBusqueda,
  type DescripcionDeResultado,
} from '@/componentes/comunes/resultado-de-busqueda';
import { Input } from '@/componentes/ui/input';
import { TECLA_ENTER } from '@/constantes/interfaz';
import { useBusquedaEnVivo } from '@/hooks/usar-busqueda-en-vivo';

type PropsBuscadorEnVivo<Resultado> = {
  rutaApi: string;
  etiqueta: string;
  describir: (resultado: Resultado) => DescripcionDeResultado;
  alElegir: (resultado: Resultado) => void;
};

export function BuscadorEnVivo<Resultado>({
  rutaApi,
  etiqueta,
  describir,
  alElegir,
}: PropsBuscadorEnVivo<Resultado>) {
  const [textoBuscado, setTextoBuscado] = useState('');
  const resultados = useBusquedaEnVivo<Resultado>(rutaApi, textoBuscado);
  const mostrarResultados =
    Boolean(textoBuscado.trim()) && resultados.length > 0;
  const elegir = useCallback(
    (resultado: Resultado) => {
      alElegir(resultado);
      setTextoBuscado('');
    },
    [alElegir]
  );
  const escribir = useCallback(
    (evento: ChangeEvent<HTMLInputElement>) =>
      setTextoBuscado(evento.target.value),
    []
  );
  const elegirElPrimeroConEnter = useCallback(
    (evento: KeyboardEvent<HTMLInputElement>) => {
      if (evento.key !== TECLA_ENTER) return;
      evento.preventDefault();
      const primero = resultados.find(
        (resultado) => describir(resultado).elegible
      );
      if (primero) elegir(primero);
    },
    [resultados, describir, elegir]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          aria-label={etiqueta}
          placeholder={etiqueta}
          className="pl-8"
          value={textoBuscado}
          onChange={escribir}
          onKeyDown={elegirElPrimeroConEnter}
        />
      </div>
      {mostrarResultados && (
        <ul className="divide-y rounded-md border">
          {resultados.map((resultado) => {
            const descripcion = describir(resultado);
            return (
              <li key={descripcion.clave}>
                <ResultadoDeBusqueda
                  resultado={resultado}
                  descripcion={descripcion}
                  alElegir={elegir}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
