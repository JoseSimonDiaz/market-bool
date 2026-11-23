import {
  ArrowDownIcon,
  ArrowUpIcon,
  HomeIcon,
  PackageIcon,
  UserCogIcon,
  type LucideIcon,
} from 'lucide-react';
import { MOVIMIENTO_STOCK } from '@/constantes/dominio';
import { RUTAS } from '@/constantes/rutas';

export type Modulo = { ruta: string; etiqueta: string; icono: LucideIcon };
export type Pestania = { ruta: string; etiqueta: string };

export const MODULOS_DE_TODOS: Modulo[] = [
  { ruta: RUTAS.inicio, etiqueta: 'Inicio', icono: HomeIcon },
  { ruta: RUTAS.productos, etiqueta: 'Productos', icono: PackageIcon },
];

export const MODULOS_DE_ADMIN: Modulo[] = [
  ...MODULOS_DE_TODOS,
  { ruta: RUTAS.usuarios, etiqueta: 'Usuarios', icono: UserCogIcon },
];

export const PESTANIAS_PRODUCTOS: Pestania[] = [
  { ruta: RUTAS.productos, etiqueta: 'Catálogo' },
  { ruta: RUTAS.existencias, etiqueta: 'Existencias' },
  { ruta: RUTAS.categorias, etiqueta: 'Categorías' },
];

export const ICONO_SEGUN_MOVIMIENTO = {
  [MOVIMIENTO_STOCK.ingreso]: ArrowUpIcon,
  [MOVIMIENTO_STOCK.egreso]: ArrowDownIcon,
} as const;
