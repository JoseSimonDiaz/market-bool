import { sql as expresionSql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import {
  ESTADO_FACTURA,
  ESTADOS_FACTURA,
  FORMAS_PAGO,
  MEDIOS_PAGO,
  ROLES,
  TIPOS_DOCUMENTO,
  TIPOS_MOVIMIENTO_CUENTA,
  TIPOS_MOVIMIENTO_STOCK,
  TIPOS_TARJETA,
} from '../constantes/dominio';

const columnaId = () => integer('id').primaryKey({ autoIncrement: true });
const fechaActualIso = () => new Date().toISOString();
const columnaFechaCreacion = (nombre = 'creado_en') =>
  text(nombre).notNull().$defaultFn(fechaActualIso);
const columnaActivo = (nombre = 'activo') =>
  integer(nombre, { mode: 'boolean' }).notNull().default(true);

export const usuarios = sqliteTable('usuarios', {
  id: columnaId(),
  email: text('email').notNull().unique(),
  nombre: text('nombre').notNull(),
  passwordHash: text('password_hash').notNull(),
  rol: text('rol', { enum: ROLES }).notNull(),
  activo: columnaActivo(),
  creadoEn: columnaFechaCreacion(),
});

export const categorias = sqliteTable('categorias', {
  id: columnaId(),
  nombre: text('nombre').notNull().unique(),
  activa: columnaActivo('activa'),
  creadoEn: columnaFechaCreacion(),
});

export const productos = sqliteTable(
  'productos',
  {
    id: columnaId(),
    codigo: text('codigo').notNull().unique(),
    descripcion: text('descripcion').notNull(),
    categoriaId: integer('categoria_id')
      .notNull()
      .references(() => categorias.id),
    precio: integer('precio').notNull(),
    existencia: integer('existencia').notNull().default(0),
    stockMinimo: integer('stock_minimo').notNull().default(0),
    activo: columnaActivo(),
    creadoEn: columnaFechaCreacion(),
  },
  (tabla) => [
    check('existencia_no_negativa', expresionSql`${tabla.existencia} >= 0`),
    index('productos_categoria_idx').on(tabla.categoriaId),
  ]
);

export const clientes = sqliteTable(
  'clientes',
  {
    id: columnaId(),
    tipoDoc: text('tipo_doc', { enum: TIPOS_DOCUMENTO }).notNull(),
    nroDocDigitos: text('nro_doc').notNull(),
    nombre: text('nombre').notNull(),
    domicilio: text('domicilio'),
    telefono: text('telefono'),
    email: text('email'),
    cuentaCorriente: integer('cuenta_corriente', { mode: 'boolean' })
      .notNull()
      .default(false),
    limiteCredito: integer('limite_credito'),
    activo: columnaActivo(),
    creadoEn: columnaFechaCreacion(),
  },
  (tabla) => [
    uniqueIndex('clientes_documento_uq').on(tabla.tipoDoc, tabla.nroDocDigitos),
  ]
);

export const facturas = sqliteTable(
  'facturas',
  {
    id: columnaId(),
    puntoVenta: integer('punto_venta').notNull(),
    numero: integer('numero').notNull(),
    fecha: columnaFechaCreacion('fecha'),
    clienteId: integer('cliente_id').references(() => clientes.id),
    usuarioId: integer('usuario_id')
      .notNull()
      .references(() => usuarios.id),
    total: integer('total').notNull(),
    formaPago: text('forma_pago', { enum: FORMAS_PAGO }).notNull(),
    tarjetaTipo: text('tarjeta_tipo', { enum: TIPOS_TARJETA }),
    tarjetaMarca: text('tarjeta_marca'),
    tarjetaUltimos4: text('tarjeta_ultimos4'),
    montoRecibido: integer('monto_recibido'),
    estado: text('estado', { enum: ESTADOS_FACTURA })
      .notNull()
      .default(ESTADO_FACTURA.emitida),
    motivoAnulacion: text('motivo_anulacion'),
    anuladaEn: text('anulada_en'),
    anuladaPorId: integer('anulada_por_id').references(() => usuarios.id),
  },
  (tabla) => [
    uniqueIndex('facturas_numero_uq').on(tabla.puntoVenta, tabla.numero),
    index('facturas_fecha_idx').on(tabla.fecha),
    index('facturas_cliente_idx').on(tabla.clienteId),
  ]
);

export const facturaItems = sqliteTable(
  'factura_items',
  {
    id: columnaId(),
    facturaId: integer('factura_id')
      .notNull()
      .references(() => facturas.id),
    productoId: integer('producto_id')
      .notNull()
      .references(() => productos.id),
    codigo: text('codigo').notNull(),
    descripcion: text('descripcion').notNull(),
    cantidad: integer('cantidad').notNull(),
    precioUnitario: integer('precio_unitario').notNull(),
    subtotal: integer('subtotal').notNull(),
    creadoEn: columnaFechaCreacion(),
  },
  (tabla) => [index('factura_items_factura_idx').on(tabla.facturaId)]
);

export const movimientosStock = sqliteTable(
  'movimientos_stock',
  {
    id: columnaId(),
    productoId: integer('producto_id')
      .notNull()
      .references(() => productos.id),
    usuarioId: integer('usuario_id')
      .notNull()
      .references(() => usuarios.id),
    facturaId: integer('factura_id').references(() => facturas.id),
    tipo: text('tipo', { enum: TIPOS_MOVIMIENTO_STOCK }).notNull(),
    cantidad: integer('cantidad').notNull(),
    existenciaResultante: integer('existencia_resultante').notNull(),
    motivo: text('motivo').notNull(),
    observacion: text('observacion'),
    fecha: columnaFechaCreacion('fecha'),
  },
  (tabla) => [
    index('movimientos_stock_producto_idx').on(tabla.productoId),
    index('movimientos_stock_fecha_idx').on(tabla.fecha),
  ]
);

export const pagos = sqliteTable('pagos', {
  id: columnaId(),
  numeroRecibo: integer('numero_recibo').notNull().unique(),
  fecha: columnaFechaCreacion('fecha'),
  clienteId: integer('cliente_id')
    .notNull()
    .references(() => clientes.id),
  usuarioId: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id),
  importe: integer('importe').notNull(),
  medio: text('medio', { enum: MEDIOS_PAGO }).notNull(),
  observacion: text('observacion'),
});

export const movimientosCuenta = sqliteTable(
  'movimientos_cuenta',
  {
    id: columnaId(),
    clienteId: integer('cliente_id')
      .notNull()
      .references(() => clientes.id),
    tipo: text('tipo', { enum: TIPOS_MOVIMIENTO_CUENTA }).notNull(),
    importe: integer('importe').notNull(),
    fecha: columnaFechaCreacion('fecha'),
    descripcion: text('descripcion').notNull(),
    facturaId: integer('factura_id').references(() => facturas.id),
    pagoId: integer('pago_id').references(() => pagos.id),
  },
  (tabla) => [index('movimientos_cuenta_cliente_idx').on(tabla.clienteId)]
);

export const numeradores = sqliteTable('numeradores', {
  clave: text('clave').primaryKey(),
  ultimo: integer('ultimo').notNull().default(0),
  creadoEn: columnaFechaCreacion(),
});

export const configuracion = sqliteTable('configuracion', {
  clave: text('clave').primaryKey(),
  valor: text('valor').notNull(),
  creadoEn: columnaFechaCreacion(),
});
