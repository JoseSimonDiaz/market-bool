import {
  COMIENZO_DEL_DIA,
  DESFASE_HORARIO_ARGENTINA,
  LARGO_ANIO_Y_MES,
  LOCALE_DIA_ISO,
  MILISEGUNDOS_POR_MINUTO,
  PRIMER_DIA_DEL_MES,
  UN_DIA,
  ZONA_HORARIA_ARGENTINA,
} from '@/constantes/formato';

const formatoDiaIso = new Intl.DateTimeFormat(LOCALE_DIA_ISO, {
  timeZone: ZONA_HORARIA_ARGENTINA,
});

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

export function ahoraIso() {
  return new Date().toISOString();
}

export function diaArgentino(momento: Date) {
  return formatoDiaIso.format(momento);
}

export function hoyEnArgentina() {
  return diaArgentino(new Date());
}

export function sumarDias(dia: string, cantidadDeDias: number) {
  const momento = comienzoDelDiaArgentino(dia);
  momento.setUTCDate(momento.getUTCDate() + cantidadDeDias);
  return diaArgentino(momento);
}

export function diasConsecutivos(desde: string, cantidadDeDias: number) {
  return Array.from({ length: cantidadDeDias }, (_dia, indice) =>
    sumarDias(desde, indice)
  );
}

export function primerDiaDelMes(dia: string) {
  return `${dia.slice(0, LARGO_ANIO_Y_MES)}${PRIMER_DIA_DEL_MES}`;
}

export function sumarMinutos(fechaIso: string, minutos: number) {
  return new Date(
    Date.parse(fechaIso) + minutos * MILISEGUNDOS_POR_MINUTO
  ).toISOString();
}
