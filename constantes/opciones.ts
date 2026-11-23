import {
  ESTADO_FILTRO,
  MOTIVOS_EGRESO,
  MOTIVOS_INGRESO,
  MOVIMIENTO_STOCK,
  ROLES,
  TIPOS_MOVIMIENTO_STOCK,
} from '@/constantes/dominio';
import {
  ETIQUETA_ESTADO_FILTRO,
  ETIQUETA_MOVIMIENTO_STOCK,
  ETIQUETA_ROL,
} from '@/constantes/etiquetas';
import { aOpcionesEtiquetadas, aOpcionesTextuales } from '@/lib/opciones';

export const OPCIONES_ROL = aOpcionesEtiquetadas(ROLES, ETIQUETA_ROL);

export const OPCIONES_ESTADO_SI_POR_DEFECTO_ACTIVOS = aOpcionesEtiquetadas(
  [ESTADO_FILTRO.inactivos, ESTADO_FILTRO.todos],
  ETIQUETA_ESTADO_FILTRO
);

export const OPCIONES_ESTADO_SI_POR_DEFECTO_TODOS = aOpcionesEtiquetadas(
  [ESTADO_FILTRO.activos, ESTADO_FILTRO.inactivos],
  ETIQUETA_ESTADO_FILTRO
);

export const OPCIONES_TIPO_MOVIMIENTO = aOpcionesEtiquetadas(
  TIPOS_MOVIMIENTO_STOCK,
  ETIQUETA_MOVIMIENTO_STOCK
);

export const OPCIONES_DE_MOTIVO = {
  [MOVIMIENTO_STOCK.ingreso]: aOpcionesTextuales(MOTIVOS_INGRESO),
  [MOVIMIENTO_STOCK.egreso]: aOpcionesTextuales(MOTIVOS_EGRESO),
};
