import { eq as esIgualA, sql as expresionSql } from 'drizzle-orm';
import { baseDeDatos } from '@/basedatos/conexion';
import * as tablas from '@/basedatos/esquema';
import {
  CATEGORIAS_DE_PRUEBA,
  PRODUCTOS_DE_PRUEBA,
  USUARIOS_DE_PRUEBA,
} from '@/constantes/datos-de-prueba';
import { ROL } from '@/constantes/dominio';
import { CENTAVOS_POR_PESO } from '@/constantes/formato';
import { NOMBRE_ARCHIVO_SEMILLA } from '@/constantes/scripts';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { buscarUsuarioActivo, hashearPassword } from '@/servicios/auth';
import { crearCategoria } from '@/servicios/categorias';
import { crearProducto } from '@/servicios/productos';

async function vaciar() {
  await baseDeDatos.delete(tablas.movimientosCuenta);
  await baseDeDatos.delete(tablas.pagos);
  await baseDeDatos.delete(tablas.movimientosStock);
  await baseDeDatos.delete(tablas.facturaItems);
  await baseDeDatos.delete(tablas.facturas);
  await baseDeDatos.delete(tablas.clientes);
  await baseDeDatos.delete(tablas.productos);
  await baseDeDatos.delete(tablas.categorias);
  await baseDeDatos.delete(tablas.usuarios);
  await baseDeDatos.delete(tablas.numeradores);
}

async function crearUsuarios() {
  for (const { password, ...usuario } of USUARIOS_DE_PRUEBA) {
    await baseDeDatos
      .insert(tablas.usuarios)
      .values({ ...usuario, passwordHash: await hashearPassword(password) });
  }
  const [admin] = await baseDeDatos
    .select({ id: tablas.usuarios.id })
    .from(tablas.usuarios)
    .where(esIgualA(tablas.usuarios.rol, ROL.admin));
  const sesion = await buscarUsuarioActivo(admin.id);
  if (!sesion) throw new Error('No se pudo crear el administrador.');
  return sesion;
}

async function crearCatalogo(admin: UsuarioSesion) {
  const idsCategorias: number[] = [];
  for (const nombre of CATEGORIAS_DE_PRUEBA) {
    idsCategorias.push((await crearCategoria(admin, { nombre })).id);
  }
  for (const [
    codigo,
    descripcion,
    indiceCategoria,
    precioEnPesos,
    stockMinimo,
    stockInicial,
  ] of PRODUCTOS_DE_PRUEBA) {
    await crearProducto(admin, {
      codigo,
      descripcion,
      categoriaId: idsCategorias[indiceCategoria],
      precio: precioEnPesos * CENTAVOS_POR_PESO,
      stockMinimo,
      stockInicial,
    });
  }
}

export async function verificarInvariantes() {
  const descuadrados = await baseDeDatos
    .select({ codigo: tablas.productos.codigo })
    .from(tablas.productos)
    .where(
      expresionSql`${tablas.productos.existencia} <> coalesce((select sum(${tablas.movimientosStock.cantidad}) from ${tablas.movimientosStock} where ${tablas.movimientosStock.productoId} = ${tablas.productos.id}), 0)`
    );
  if (descuadrados.length > 0) {
    throw new Error(
      `Stock descuadrado: ${descuadrados.map((productoDescuadrado) => productoDescuadrado.codigo).join(', ')}`
    );
  }
}

export async function baseVacia() {
  return (await baseDeDatos.$count(tablas.usuarios)) === 0;
}

export async function sembrar() {
  await vaciar();
  const admin = await crearUsuarios();
  await crearCatalogo(admin);
  await verificarInvariantes();
  process.stdout.write(
    `Datos de prueba: ${USUARIOS_DE_PRUEBA.length} usuarios, ${CATEGORIAS_DE_PRUEBA.length} categorías, ${PRODUCTOS_DE_PRUEBA.length} productos.\n`
  );
  process.stdout.write('Invariantes: stock = suma de movimientos ✔\n');
}

const ejecutadoComoScript = process.argv[1]?.endsWith(NOMBRE_ARCHIVO_SEMILLA);
if (ejecutadoComoScript) {
  await sembrar();
}
