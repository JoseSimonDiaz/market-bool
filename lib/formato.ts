import {
  LARGO_CUIT,
  TIPO_DOCUMENTO,
  type TipoDocumento,
} from '@/constantes/dominio';
import {
  CENTAVOS_POR_PESO,
  DECIMALES_DE_MONEDA,
  DIGITOS_NUMERO_COMPROBANTE,
  DIGITOS_PUNTO_VENTA,
  ESPACIO_DURO,
  IMPORTE_EN_PESOS_VALIDO,
  LARGO_PREFIJO_CUIT,
  LARGO_PREFIJO_Y_DNI_CUIT,
  LOCALE_ARGENTINA,
  MONEDA_PESO,
  NO_DIGITOS,
  PREFIJO_RECIBO,
  PUNTO_DECIMAL,
  RELLENO_NUMERACION,
  SEPARADOR_DECIMAL,
  SEPARADOR_MILES,
  ZONA_HORARIA_ARGENTINA,
} from '@/constantes/formato';

const formatoMoneda = new Intl.NumberFormat(LOCALE_ARGENTINA, {
  style: 'currency',
  currency: MONEDA_PESO,
  minimumFractionDigits: DECIMALES_DE_MONEDA,
});
const formatoFecha = new Intl.DateTimeFormat(LOCALE_ARGENTINA, {
  timeZone: ZONA_HORARIA_ARGENTINA,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});
const formatoHora = new Intl.DateTimeFormat(LOCALE_ARGENTINA, {
  timeZone: ZONA_HORARIA_ARGENTINA,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});
const formatoEntero = new Intl.NumberFormat(LOCALE_ARGENTINA);

export function formatearMoneda(centavos: number) {
  return formatoMoneda
    .format(centavos / CENTAVOS_POR_PESO)
    .replace(ESPACIO_DURO, ' ');
}

export function centavosAPesos(centavos: number) {
  return (centavos / CENTAVOS_POR_PESO)
    .toFixed(DECIMALES_DE_MONEDA)
    .replace(PUNTO_DECIMAL, SEPARADOR_DECIMAL);
}

export function pesosACentavos(textoEnPesos: string) {
  const importeNormalizado = textoEnPesos
    .trim()
    .replace(SEPARADOR_MILES, '')
    .replace(SEPARADOR_DECIMAL, PUNTO_DECIMAL);
  if (!IMPORTE_EN_PESOS_VALIDO.test(importeNormalizado)) return Number.NaN;
  return Math.round(Number(importeNormalizado) * CENTAVOS_POR_PESO);
}

export function formatearEntero(numeroEntero: number) {
  return formatoEntero.format(numeroEntero);
}

export function formatearFecha(fechaIso: string) {
  return formatoFecha.format(new Date(fechaIso));
}

export function formatearFechaHora(fechaIso: string) {
  const momento = new Date(fechaIso);
  return `${formatoFecha.format(momento)} ${formatoHora.format(momento)}`;
}

export function formatearNumeroComprobante(puntoVenta: number, numero: number) {
  const puntoVentaConCeros = String(puntoVenta).padStart(
    DIGITOS_PUNTO_VENTA,
    RELLENO_NUMERACION
  );
  const numeroConCeros = String(numero).padStart(
    DIGITOS_NUMERO_COMPROBANTE,
    RELLENO_NUMERACION
  );
  return `${puntoVentaConCeros}-${numeroConCeros}`;
}

export function formatearRecibo(puntoVenta: number, numero: number) {
  return `${PREFIJO_RECIBO} ${formatearNumeroComprobante(puntoVenta, numero)}`;
}

export function soloDigitos(texto: string) {
  return texto.replace(NO_DIGITOS, '');
}

function formatearCuit(digitos: string) {
  const prefijo = digitos.slice(0, LARGO_PREFIJO_CUIT);
  const documento = digitos.slice(LARGO_PREFIJO_CUIT, LARGO_PREFIJO_Y_DNI_CUIT);
  const verificador = digitos.slice(LARGO_PREFIJO_Y_DNI_CUIT);
  return `${prefijo}-${documento}-${verificador}`;
}

export function formatearDocumento(tipo: TipoDocumento, digitos: string) {
  const esCuitCompleto =
    tipo === TIPO_DOCUMENTO.cuit && digitos.length === LARGO_CUIT;
  if (esCuitCompleto) return formatearCuit(digitos);
  return formatoEntero.format(Number(digitos));
}
