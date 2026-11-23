import { ROL, type Rol } from '@/constantes/dominio';
import { METODO_HTTP, type MetodoHttp } from '@/constantes/http';
import { PATRONES_PAGINA, RUTAS, RUTAS_API } from '@/constantes/rutas';

export type ReglasDeEndpoints = Record<string, MetodoHttp[]>;

const {
  get: LEER,
  post: CREAR,
  put: REEMPLAZAR,
  patch: MODIFICAR,
} = METODO_HTTP;

export const PAGINAS_PUBLICAS: string[] = [RUTAS.login];

export const ENDPOINTS_PUBLICOS: ReglasDeEndpoints = {
  [RUTAS_API.login]: [CREAR],
};

const PAGINAS_DE_TODOS: string[] = [
  RUTAS.inicio,
  RUTAS.perfil,
  RUTAS.sinPermiso,
  RUTAS.productos,
  RUTAS.categorias,
  RUTAS.existencias,
  PATRONES_PAGINA.producto,
  RUTAS.clientes,
  RUTAS.saldos,
  PATRONES_PAGINA.cliente,
  PATRONES_PAGINA.cuentaCliente,
  PATRONES_PAGINA.recibo,
  RUTAS.ventas,
  RUTAS.nuevaVenta,
  PATRONES_PAGINA.venta,
];

export const PAGINAS_POR_ROL: Record<Rol, string[]> = {
  [ROL.admin]: [...PAGINAS_DE_TODOS, RUTAS.usuarios],
  [ROL.vendedor]: PAGINAS_DE_TODOS,
};

const ENDPOINTS_DE_TODOS: ReglasDeEndpoints = {
  [RUTAS_API.logout]: [CREAR],
  [RUTAS_API.sesionActual]: [LEER],
  [RUTAS_API.passwordPropia]: [REEMPLAZAR],
  [RUTAS_API.categorias]: [LEER],
  [RUTAS_API.productos]: [LEER],
  [RUTAS_API.producto]: [LEER],
  [RUTAS_API.movimientosDeProducto]: [LEER],
  [RUTAS_API.movimientos]: [LEER],
  [RUTAS_API.clientes]: [LEER, CREAR],
  [RUTAS_API.cliente]: [LEER, MODIFICAR],
  [RUTAS_API.cuentaDeCliente]: [LEER],
  [RUTAS_API.pagosDeCliente]: [CREAR],
  [RUTAS_API.pago]: [LEER],
  [RUTAS_API.facturas]: [LEER, CREAR],
  [RUTAS_API.numeracionDeFacturas]: [LEER],
  [RUTAS_API.factura]: [LEER],
};

const ENDPOINTS_DE_ADMIN: ReglasDeEndpoints = {
  ...ENDPOINTS_DE_TODOS,
  [RUTAS_API.usuarios]: [LEER, CREAR],
  [RUTAS_API.usuario]: [MODIFICAR],
  [RUTAS_API.passwordDeUsuario]: [CREAR],
  [RUTAS_API.categorias]: [LEER, CREAR],
  [RUTAS_API.categoria]: [MODIFICAR],
  [RUTAS_API.productos]: [LEER, CREAR],
  [RUTAS_API.producto]: [LEER, MODIFICAR],
  [RUTAS_API.movimientosDeProducto]: [LEER, CREAR],
  [RUTAS_API.anulacionDeFactura]: [CREAR],
};

export const ENDPOINTS_POR_ROL: Record<Rol, ReglasDeEndpoints> = {
  [ROL.admin]: ENDPOINTS_DE_ADMIN,
  [ROL.vendedor]: ENDPOINTS_DE_TODOS,
};
