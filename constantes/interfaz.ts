import { ESTADO_FACTURA, MOVIMIENTO_STOCK, ROL } from '@/constantes/dominio';

export const VALOR_MINIMO_ENTERO = 0;
export const PASO_ENTERO = 1;
export const PLACEHOLDER_SELECCION = 'Elegí una opción';
export const SEPARADOR_MENSAJES = ' ';
export const UN_RESULTADO = 1;
export const SIN_REFERENCIA = '—';
export const SIGNO_POSITIVO = '+';

export const GRAVEDAD = {
  irreversible: 'irreversible',
  reversible: 'reversible',
} as const;

export type GravedadAccion = (typeof GRAVEDAD)[keyof typeof GRAVEDAD];

export const VARIANTE_CONFIRMACION: Record<
  GravedadAccion,
  'destructive' | 'default'
> = {
  [GRAVEDAD.irreversible]: 'destructive',
  [GRAVEDAD.reversible]: 'default',
};

export const PRESENTACION_SEGUN_ESTADO = {
  activo: { gravedad: GRAVEDAD.irreversible, variante: 'destructive' },
  inactivo: { gravedad: GRAVEDAD.reversible, variante: 'outline' },
} as const;

export const VARIANTE_SEGUN_ESTADO_FACTURA = {
  [ESTADO_FACTURA.emitida]: 'secondary',
  [ESTADO_FACTURA.anulada]: 'destructive',
} as const;

export const VARIANTE_SEGUN_ROL = {
  [ROL.admin]: 'default',
  [ROL.vendedor]: 'outline',
} as const;

export const TEXTOS_MOVIMIENTO_MANUAL = {
  [MOVIMIENTO_STOCK.ingreso]: {
    titulo: 'Ingreso de stock',
    etiqueta: 'Ingreso',
    boton: 'Registrar ingreso',
  },
  [MOVIMIENTO_STOCK.egreso]: {
    titulo: 'Egreso de stock',
    etiqueta: 'Egreso',
    boton: 'Registrar egreso',
  },
} as const;
