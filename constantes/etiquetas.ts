import {
  ESTADO_FILTRO,
  ROL,
  type EstadoFiltro,
  type Rol,
  type TipoMovimientoStock,
} from '@/constantes/dominio';

export const ETIQUETA_MOVIMIENTO_STOCK: Record<TipoMovimientoStock, string> = {
  venta: 'Venta',
  anulacion: 'Anulación',
  ingreso: 'Ingreso',
  egreso: 'Egreso',
};

export const ETIQUETA_ROL: Record<Rol, string> = {
  [ROL.admin]: 'Administrador',
  [ROL.vendedor]: 'Vendedor',
};

export const ETIQUETA_ESTADO_FILTRO: Record<EstadoFiltro, string> = {
  [ESTADO_FILTRO.activos]: 'Activos',
  [ESTADO_FILTRO.inactivos]: 'Inactivos',
  [ESTADO_FILTRO.todos]: 'Activos e inactivos',
};

export type TextosCambioEstado = {
  accion: string;
  titulo: string;
  descripcion: string;
  mensajeExito: string;
};

export type TextosCambioEstadoEntidad = {
  desactivar: TextosCambioEstado;
  activar: TextosCambioEstado;
};

export const TEXTOS_ESTADO_USUARIO: TextosCambioEstadoEntidad = {
  desactivar: {
    accion: 'Desactivar',
    titulo: 'Desactivar usuario',
    descripcion: 'El usuario no va a poder ingresar al sistema.',
    mensajeExito: 'Usuario desactivado.',
  },
  activar: {
    accion: 'Activar',
    titulo: 'Activar usuario',
    descripcion: 'El usuario va a poder ingresar de nuevo.',
    mensajeExito: 'Usuario activado.',
  },
};

export const TEXTOS_ESTADO_PRODUCTO: TextosCambioEstadoEntidad = {
  desactivar: {
    accion: 'Dar de baja',
    titulo: 'Dar de baja el producto',
    descripcion: 'Deja de ofrecerse en ventas, pero conserva su historial.',
    mensajeExito: 'Producto dado de baja.',
  },
  activar: {
    accion: 'Reactivar',
    titulo: 'Reactivar producto',
    descripcion: 'Vuelve a ofrecerse en ventas.',
    mensajeExito: 'Producto reactivado.',
  },
};

export const TEXTOS_ESTADO_CATEGORIA: TextosCambioEstadoEntidad = {
  desactivar: {
    accion: 'Desactivar',
    titulo: 'Desactivar categoría',
    descripcion: 'Solo se puede desactivar si no tiene productos activos.',
    mensajeExito: 'Categoría desactivada.',
  },
  activar: {
    accion: 'Activar',
    titulo: 'Activar categoría',
    descripcion: 'Vuelve a estar disponible para nuevos productos.',
    mensajeExito: 'Categoría activada.',
  },
};
