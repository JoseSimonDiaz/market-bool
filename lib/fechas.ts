import {
  COMIENZO_DEL_DIA,
  DESFASE_HORARIO_ARGENTINA,
  UN_DIA,
} from '@/constantes/formato';

function comienzoDelDiaArgentino(dia: string) {
  return new Date(`${dia}${COMIENZO_DEL_DIA}${DESFASE_HORARIO_ARGENTINA}`);
}

export function inicioDiaArgentina(dia: string) {
  return comienzoDelDiaArgentino(dia).toISOString();
}

export function finDiaArgentina(dia: string) {
  const comienzoDelDiaSiguiente = comienzoDelDiaArgentino(dia);
  comienzoDelDiaSiguiente.setUTCDate(
    comienzoDelDiaSiguiente.getUTCDate() + UN_DIA
  );
  return comienzoDelDiaSiguiente.toISOString();
}
