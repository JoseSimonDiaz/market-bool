export const ROL = { admin: 'admin', vendedor: 'vendedor' } as const;
export const ROLES = [ROL.admin, ROL.vendedor] as const;
export type Rol = (typeof ROLES)[number];

export const MOVIMIENTO_STOCK = {
  venta: 'venta',
  anulacion: 'anulacion',
  ingreso: 'ingreso',
  egreso: 'egreso',
} as const;
export const TIPOS_MOVIMIENTO_STOCK = [
  MOVIMIENTO_STOCK.venta,
  MOVIMIENTO_STOCK.anulacion,
  MOVIMIENTO_STOCK.ingreso,
  MOVIMIENTO_STOCK.egreso,
] as const;
export type TipoMovimientoStock = (typeof TIPOS_MOVIMIENTO_STOCK)[number];

export const EXISTENCIA_MINIMA = 0;

export const SIGNO_MOVIMIENTO_MANUAL = {
  [MOVIMIENTO_STOCK.ingreso]: 1,
  [MOVIMIENTO_STOCK.egreso]: -1,
} as const;

export const MOTIVO_STOCK_INICIAL = 'Stock inicial';
export const MOTIVOS_INGRESO = [
  'Reposición',
  MOTIVO_STOCK_INICIAL,
  'Devolución de cliente',
] as const;
export const MOTIVOS_EGRESO = [
  'Rotura',
  'Vencimiento',
  'Ajuste de inventario',
  'Uso interno',
] as const;

export const TIPO_DOCUMENTO = { dni: 'DNI', cuit: 'CUIT' } as const;
export const TIPOS_DOCUMENTO = [
  TIPO_DOCUMENTO.dni,
  TIPO_DOCUMENTO.cuit,
] as const;
export type TipoDocumento = (typeof TIPOS_DOCUMENTO)[number];
export const LARGO_CUIT = 11;

export const FORMAS_PAGO = ['contado', 'tarjeta', 'cuenta_corriente'] as const;
export type FormaPago = (typeof FORMAS_PAGO)[number];

export const TIPOS_TARJETA = ['debito', 'credito'] as const;

export const ESTADO_FACTURA = {
  emitida: 'emitida',
  anulada: 'anulada',
} as const;
export const ESTADOS_FACTURA = [
  ESTADO_FACTURA.emitida,
  ESTADO_FACTURA.anulada,
] as const;
export type EstadoFactura = (typeof ESTADOS_FACTURA)[number];

export const MEDIOS_PAGO = [
  'efectivo',
  'transferencia',
  'tarjeta_debito',
] as const;

export const TIPOS_MOVIMIENTO_CUENTA = ['debito', 'credito'] as const;

export const PUNTO_VENTA = 1;
export const NUMERADOR = {
  factura: `factura_${PUNTO_VENTA}`,
  recibo: 'recibo',
} as const;

export const ESTADO_FILTRO = {
  activos: 'activos',
  inactivos: 'inactivos',
  todos: 'todos',
} as const;
export const ESTADOS_FILTRO = [
  ESTADO_FILTRO.activos,
  ESTADO_FILTRO.inactivos,
  ESTADO_FILTRO.todos,
] as const;
export type EstadoFiltro = (typeof ESTADOS_FILTRO)[number];

export const PAGINA = { tamanioPorDefecto: 20, tamanioMaximo: 100 } as const;

export const LONGITUD_MINIMA_PASSWORD = 8;
export const LONGITUD_MAXIMA_PASSWORD = 100;
