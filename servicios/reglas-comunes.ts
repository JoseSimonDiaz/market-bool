import {
  existeOtroRegistroConValor,
  type BusquedaDeDuplicado,
} from '@/basedatos/consultas';
import type { DefinicionError } from '@/constantes/errores';
import { crearError } from '@/servicios/errores';

type ExigenciaDeValorUnico = BusquedaDeDuplicado & {
  errorSiExiste: DefinicionError;
  campo: string;
};

export async function exigirValorUnico({
  errorSiExiste,
  campo,
  ...busqueda
}: ExigenciaDeValorUnico) {
  if (await existeOtroRegistroConValor(busqueda)) {
    throw crearError(errorSiExiste, [
      { campo, mensaje: errorSiExiste.mensaje },
    ]);
  }
}

export function hayCambios(cambios: object) {
  return Object.keys(cambios).length > 0;
}
