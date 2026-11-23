import {
  MOTIVOS_EGRESO,
  MOTIVOS_INGRESO,
  MOVIMIENTO_STOCK,
  ROL,
  type Rol,
} from '@/constantes/dominio';
import {
  esquemaAltaProducto,
  type DatosAltaCategoria,
  type DatosMovimientoManual,
  type TipoMovimientoManual,
} from '@/esquemas/productos';
import {
  esquemaAltaUsuario,
  type DatosCambioPassword,
  type DatosLogin,
} from '@/esquemas/usuarios';
import type { Opcion } from '@/lib/opciones';

export type CamposComunesProducto = {
  codigo: string;
  descripcion: string;
  categoriaId: number;
  precio: number;
  stockMinimo: number;
};

export type CamposComunesUsuario = { nombre: string; email: string; rol: Rol };

const { stockInicial: _campoSoloDelAltaDeProducto, ...camposDeProducto } =
  esquemaAltaProducto.keyof().enum;
const { password: _campoSoloDelAltaDeUsuario, ...camposDeUsuario } =
  esquemaAltaUsuario.keyof().enum;

export const CAMPOS_COMUNES_PRODUCTO = camposDeProducto;
export const CAMPOS_COMUNES_USUARIO = camposDeUsuario;

export const CREDENCIALES_VACIAS: DatosLogin = { email: '', password: '' };
export const PASSWORDS_VACIAS: DatosCambioPassword = { actual: '', nueva: '' };
export const CATEGORIA_NUEVA: DatosAltaCategoria = { nombre: '' };
export const SIN_CATEGORIAS: Opcion<number>[] = [];

export const PRODUCTO_SIN_DATOS: CamposComunesProducto = {
  codigo: '',
  descripcion: '',
  categoriaId: Number.NaN,
  precio: Number.NaN,
  stockMinimo: 0,
};

export const PRODUCTO_NUEVO = { ...PRODUCTO_SIN_DATOS, stockInicial: 0 };

export const USUARIO_SIN_DATOS: CamposComunesUsuario = {
  nombre: '',
  email: '',
  rol: ROL.vendedor,
};

export const USUARIO_NUEVO = { ...USUARIO_SIN_DATOS, password: '' };

export const MOVIMIENTO_NUEVO: Record<
  TipoMovimientoManual,
  DatosMovimientoManual
> = {
  [MOVIMIENTO_STOCK.ingreso]: {
    tipo: MOVIMIENTO_STOCK.ingreso,
    cantidad: Number.NaN,
    motivo: MOTIVOS_INGRESO[0],
    observacion: '',
  },
  [MOVIMIENTO_STOCK.egreso]: {
    tipo: MOVIMIENTO_STOCK.egreso,
    cantidad: Number.NaN,
    motivo: MOTIVOS_EGRESO[0],
    observacion: '',
  },
};
