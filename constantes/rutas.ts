export const PREFIJO_API = '/api';
export const SEGMENTO_ID = ':id';

export const RUTAS = {
  inicio: '/',
  login: '/login',
  perfil: '/perfil',
  sinPermiso: '/sinpermiso',
  productos: '/productos',
  productosBajoMinimo: '/productos?bajoMinimo=true',
  producto: (id: number) => `/productos/${id}`,
  categorias: '/productos/categorias',
  existencias: '/productos/movimientos',
  usuarios: '/usuarios',
  clientes: '/clientes',
  cliente: (id: number) => `/clientes/${id}`,
  cuentaCliente: (id: number) => `/clientes/${id}/cuenta`,
  saldos: '/clientes/saldos',
  recibo: (id: number) => `/clientes/recibos/${id}`,
  ventas: '/ventas',
  nuevaVenta: '/ventas/nueva',
  venta: (id: number) => `/ventas/${id}`,
} as const;

export const PATRONES_PAGINA = {
  producto: `/productos/${SEGMENTO_ID}`,
  cliente: `/clientes/${SEGMENTO_ID}`,
  cuentaCliente: `/clientes/${SEGMENTO_ID}/cuenta`,
  recibo: `/clientes/recibos/${SEGMENTO_ID}`,
  venta: `/ventas/${SEGMENTO_ID}`,
} as const;

export const RUTAS_DE_ARCHIVO = {
  producto: '/productos/[id]',
  cliente: '/clientes/[id]',
  cuentaCliente: '/clientes/[id]/cuenta',
  recibo: '/clientes/recibos/[id]',
  venta: '/ventas/[id]',
} as const;

export const RUTAS_API = {
  login: `${PREFIJO_API}/auth/login`,
  logout: `${PREFIJO_API}/auth/logout`,
  sesionActual: `${PREFIJO_API}/auth/me`,
  passwordPropia: `${PREFIJO_API}/auth/password`,
  usuarios: `${PREFIJO_API}/usuarios`,
  usuario: `${PREFIJO_API}/usuarios/${SEGMENTO_ID}`,
  passwordDeUsuario: `${PREFIJO_API}/usuarios/${SEGMENTO_ID}/password`,
  categorias: `${PREFIJO_API}/categorias`,
  categoria: `${PREFIJO_API}/categorias/${SEGMENTO_ID}`,
  productos: `${PREFIJO_API}/productos`,
  producto: `${PREFIJO_API}/productos/${SEGMENTO_ID}`,
  movimientosDeProducto: `${PREFIJO_API}/productos/${SEGMENTO_ID}/movimientos`,
  movimientos: `${PREFIJO_API}/movimientos`,
  clientes: `${PREFIJO_API}/clientes`,
  cliente: `${PREFIJO_API}/clientes/${SEGMENTO_ID}`,
  cuentaDeCliente: `${PREFIJO_API}/clientes/${SEGMENTO_ID}/cuenta`,
  pagosDeCliente: `${PREFIJO_API}/clientes/${SEGMENTO_ID}/pagos`,
  pago: `${PREFIJO_API}/pagos/${SEGMENTO_ID}`,
  facturas: `${PREFIJO_API}/facturas`,
  factura: `${PREFIJO_API}/facturas/${SEGMENTO_ID}`,
  anulacionDeFactura: `${PREFIJO_API}/facturas/${SEGMENTO_ID}/anulacion`,
  numeracionDeFacturas: `${PREFIJO_API}/facturas/numeracion`,
  tablero: `${PREFIJO_API}/tablero`,
} as const;

export const ALCANCE_REVALIDACION_LAYOUT = 'layout';

export const SEGMENTO_VARIABLE_DE_RUTA = /:\w+/g;
export const PATRON_DE_UN_SEGMENTO = '[^/]+';
