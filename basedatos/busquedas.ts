import { productos, usuarios } from '@/basedatos/esquema';

export const COLUMNAS_BUSQUEDA_USUARIOS = [usuarios.nombre, usuarios.email];
export const COLUMNAS_BUSQUEDA_PRODUCTOS = [
  productos.codigo,
  productos.descripcion,
];
