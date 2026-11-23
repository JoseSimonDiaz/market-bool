export const PREFIJO_API = '/api';
export const SEGMENTO_ID = ':id';

export const RUTAS = {
  inicio: '/',
  login: '/login',
  perfil: '/perfil',
  sinPermiso: '/sinpermiso',
  productos: '/productos',
  producto: (id: number) => `/productos/${id}`,
  categorias: '/productos/categorias',
  existencias: '/productos/movimientos',
  usuarios: '/usuarios',
} as const;

export const PATRONES_PAGINA = {
  producto: `/productos/${SEGMENTO_ID}`,
} as const;

export const RUTAS_DE_ARCHIVO = {
  producto: '/productos/[id]',
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
} as const;

export const ALCANCE_REVALIDACION_LAYOUT = 'layout';

export const SEGMENTO_VARIABLE_DE_RUTA = /:\w+/g;
export const PATRON_DE_UN_SEGMENTO = '[^/]+';
