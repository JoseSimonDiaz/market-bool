import { EnlacePestania } from '@/componentes/comunes/enlace-pestania';
import type { Pestania } from '@/constantes/navegacion';
import { CLASE_NO_IMPRIMIR } from '@/constantes/estilos';
import { combinarClases } from '@/lib/utils';

export function PestaniasDeNavegacion({
  pestanias,
  descripcion,
}: {
  pestanias: Pestania[];
  descripcion: string;
}) {
  return (
    <nav
      aria-label={descripcion}
      className={combinarClases(CLASE_NO_IMPRIMIR, 'border-b')}
    >
      <ul className="-mb-px flex gap-4 overflow-x-auto">
        {pestanias.map((pestania) => (
          <li key={pestania.ruta}>
            <EnlacePestania pestania={pestania} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
