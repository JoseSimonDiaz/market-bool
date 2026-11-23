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
export const LARGO_DNI = { minimo: 7, maximo: 8 } as const;

export const FORMA_PAGO = {
  contado: 'contado',
  tarjeta: 'tarjeta',
  cuentaCorriente: 'cuenta_corriente',
} as const;
export const FORMAS_PAGO = [
  FORMA_PAGO.contado,
  FORMA_PAGO.tarjeta,
  FORMA_PAGO.cuentaCorriente,
] as const;
export type FormaPago = (typeof FORMAS_PAGO)[number];

export const TIPO_TARJETA = { debito: 'debito', credito: 'credito' } as const;
export const TIPOS_TARJETA = [
  TIPO_TARJETA.debito,
  TIPO_TARJETA.credito,
] as const;
export type TipoTarjeta = (typeof TIPOS_TARJETA)[number];
export const DIGITOS_VISIBLES_TARJETA = 4;

export const MOTIVO_VENTA = 'Venta';
export const MOTIVO_ANULACION = 'Anulación de factura';
export const IMPORTE_CERO = 0;

export const ESTADO_FACTURA = {
  emitida: 'emitida',
  anulada: 'anulada',
} as const;
export const ESTADOS_FACTURA = [
  ESTADO_FACTURA.emitida,
  ESTADO_FACTURA.anulada,
] as const;
export type EstadoFactura = (typeof ESTADOS_FACTURA)[number];

export const MEDIO_PAGO = {
  efectivo: 'efectivo',
  transferencia: 'transferencia',
  tarjetaDebito: 'tarjeta_debito',
} as const;
export const MEDIOS_PAGO = [
  MEDIO_PAGO.efectivo,
  MEDIO_PAGO.transferencia,
  MEDIO_PAGO.tarjetaDebito,
] as const;
export type MedioPago = (typeof MEDIOS_PAGO)[number];

export const MOVIMIENTO_CUENTA = {
  debito: 'debito',
  credito: 'credito',
} as const;
export const TIPOS_MOVIMIENTO_CUENTA = [
  MOVIMIENTO_CUENTA.debito,
  MOVIMIENTO_CUENTA.credito,
] as const;
export type TipoMovimientoCuenta = (typeof TIPOS_MOVIMIENTO_CUENTA)[number];
export const SIGNO_MOVIMIENTO_CUENTA: Record<TipoMovimientoCuenta, number> = {
  [MOVIMIENTO_CUENTA.debito]: 1,
  [MOVIMIENTO_CUENTA.credito]: -1,
};

export const ORDEN_CLIENTES = { nombre: 'nombre', saldo: 'saldo' } as const;
export const ORDENES_CLIENTES = [
  ORDEN_CLIENTES.nombre,
  ORDEN_CLIENTES.saldo,
] as const;

export const CANTIDAD_ULTIMAS_FACTURAS = 6;
export const SALDO_SALDADO = 0;

export const PRIMER_NUMERO = 1;
export const INCREMENTO_NUMERADOR = 1;

export const PUNTO_VENTA = 1;
export const NUMERADOR = {
  factura: `factura_${PUNTO_VENTA}`,
  recibo: 'recibo',
} as const;

export const ESTADO_FILTRO = {
  activos: 'true',
  inactivos: 'false',
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
