import {
  ESTADO_FACTURA,
  ESTADO_FILTRO,
  FORMA_PAGO,
  TIPO_TARJETA,
  MEDIO_PAGO,
  MOVIMIENTO_CUENTA,
  ROL,
  TIPO_DOCUMENTO,
  type EstadoFactura,
  type EstadoFiltro,
  type FormaPago,
  type TipoTarjeta,
  type MedioPago,
  type Rol,
  type TipoDocumento,
  type TipoMovimientoCuenta,
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

export const ETIQUETA_MEDIO_PAGO: Record<MedioPago, string> = {
  [MEDIO_PAGO.efectivo]: 'Efectivo',
  [MEDIO_PAGO.transferencia]: 'Transferencia',
  [MEDIO_PAGO.tarjetaDebito]: 'Tarjeta de débito',
};

export const ETIQUETA_TIPO_DOCUMENTO: Record<TipoDocumento, string> = {
  [TIPO_DOCUMENTO.dni]: 'DNI',
  [TIPO_DOCUMENTO.cuit]: 'CUIT',
};

export const ETIQUETA_MOVIMIENTO_CUENTA: Record<TipoMovimientoCuenta, string> =
  {
    [MOVIMIENTO_CUENTA.debito]: 'Débito',
    [MOVIMIENTO_CUENTA.credito]: 'Crédito',
  };

export const TEXTOS_ESTADO_CLIENTE: TextosCambioEstadoEntidad = {
  desactivar: {
    accion: 'Dar de baja',
    titulo: 'Dar de baja el cliente',
    descripcion:
      'Solo se puede si su saldo está en cero. Conserva su historial.',
    mensajeExito: 'Cliente dado de baja.',
  },
  activar: {
    accion: 'Reactivar',
    titulo: 'Reactivar cliente',
    descripcion: 'Vuelve a estar disponible para ventas y pagos.',
    mensajeExito: 'Cliente reactivado.',
  },
};

export const DESCRIPCION_MOVIMIENTO_CUENTA = {
  factura: (numero: string) => `Factura ${numero}`,
  anulacion: (numero: string) => `Anulación factura ${numero}`,
  recibo: (numeroRecibo: string) => `Recibo ${numeroRecibo}`,
};

export const ETIQUETA_FORMA_PAGO: Record<FormaPago, string> = {
  [FORMA_PAGO.contado]: 'Contado',
  [FORMA_PAGO.tarjeta]: 'Tarjeta',
  [FORMA_PAGO.cuentaCorriente]: 'Cuenta corriente',
};

export const ETIQUETA_ESTADO_FACTURA: Record<EstadoFactura, string> = {
  [ESTADO_FACTURA.emitida]: 'Emitida',
  [ESTADO_FACTURA.anulada]: 'Anulada',
};

export const ETIQUETA_TIPO_TARJETA: Record<TipoTarjeta, string> = {
  [TIPO_TARJETA.debito]: 'Débito',
  [TIPO_TARJETA.credito]: 'Crédito',
};

export const TEXTO_CONSUMIDOR_FINAL = 'Consumidor final';
