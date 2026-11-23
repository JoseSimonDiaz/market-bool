import type { ReglasDeEndpoints } from '@/constantes/permisos';
import {
  PATRON_DE_UN_SEGMENTO,
  SEGMENTO_VARIABLE_DE_RUTA,
} from '@/constantes/rutas';

function aExpresionRegular(patron: string) {
  return new RegExp(
    `^${patron.replace(SEGMENTO_VARIABLE_DE_RUTA, PATRON_DE_UN_SEGMENTO)}$`
  );
}

export function coincideConPatron(ruta: string, patron: string) {
  return aExpresionRegular(patron).test(ruta);
}

export function paginaPermitida(ruta: string, patrones: string[]) {
  return patrones.some((patron) => coincideConPatron(ruta, patron));
}

export function endpointPermitido(
  ruta: string,
  metodo: string,
  reglas: ReglasDeEndpoints
) {
  return Object.entries(reglas).some(
    ([patron, metodosPermitidos]) =>
      coincideConPatron(ruta, patron) &&
      metodosPermitidos.some((metodoPermitido) => metodoPermitido === metodo)
  );
}
