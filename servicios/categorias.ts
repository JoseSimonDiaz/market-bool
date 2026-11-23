import {
  and as cumplenTodas,
  asc as ascendente,
  count as contarFilas,
  eq as esIgualA,
  sql as expresionSql,
} from 'drizzle-orm';
import { baseDeDatos } from '@/basedatos/conexion';
import { categorias, productos } from '@/basedatos/esquema';
import { ALIAS_SQL } from '@/constantes/basedatos';
import { ERRORES } from '@/constantes/errores';
import { MENSAJES_VALIDACION } from '@/constantes/mensajes';
import { esquemaId } from '@/esquemas/comunes';
import {
  esquemaAltaCategoria,
  esquemaAltaProducto,
  esquemaEdicionCategoria,
  esquemaFiltroCategorias,
} from '@/esquemas/productos';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { crearError } from '@/servicios/errores';
import { exigirAdmin } from '@/servicios/permisos';
import { exigirValorUnico, hayCambios } from '@/servicios/reglas-comunes';

export type Categoria = {
  id: number;
  nombre: string;
  activa: boolean;
  productosActivos: number;
};

export type OpcionCategoria = { valor: number; etiqueta: string };

const productosActivosPorCategoria = baseDeDatos
  .select({
    categoriaId: productos.categoriaId,
    cantidad: contarFilas().as(ALIAS_SQL.cantidad),
  })
  .from(productos)
  .where(esIgualA(productos.activo, true))
  .groupBy(productos.categoriaId)
  .as(ALIAS_SQL.conteoPorCategoria);

const seleccionarCategoriasConConteo = () =>
  baseDeDatos
    .select({
      id: categorias.id,
      nombre: categorias.nombre,
      activa: categorias.activa,
      productosActivos: expresionSql<number>`coalesce(${productosActivosPorCategoria.cantidad}, 0)`,
    })
    .from(categorias)
    .leftJoin(
      productosActivosPorCategoria,
      esIgualA(productosActivosPorCategoria.categoriaId, categorias.id)
    );

const columnasCategoriaPublica = {
  id: categorias.id,
  nombre: categorias.nombre,
  activa: categorias.activa,
};

const estaActiva = esIgualA(categorias.activa, true);

function exigirNombreLibre(nombre: string, idExcluido?: number) {
  return exigirValorUnico({
    tabla: categorias,
    columna: categorias.nombre,
    valorBuscado: nombre,
    idExcluido,
    errorSiExiste: ERRORES.NOMBRE_DUPLICADO,
    campo: esquemaAltaCategoria.keyof().enum.nombre,
  });
}

async function buscarCategoriaPorId(categoriaId: number) {
  const [categoriaEncontrada] = await baseDeDatos
    .select(columnasCategoriaPublica)
    .from(categorias)
    .where(esIgualA(categorias.id, categoriaId));
  if (!categoriaEncontrada) throw crearError(ERRORES.NO_ENCONTRADO);
  return categoriaEncontrada;
}

async function exigirQueNoTengaProductosActivos(categoriaId: number) {
  const cantidad = await baseDeDatos.$count(
    productos,
    cumplenTodas(
      esIgualA(productos.categoriaId, categoriaId),
      esIgualA(productos.activo, true)
    )
  );
  if (cantidad > 0) throw crearError(ERRORES.CATEGORIA_EN_USO);
}

// Categorías: alta, edición y baja.
export async function listarCategoriasActivas(
  _usuarioActual: UsuarioSesion
): Promise<Categoria[]> {
  return seleccionarCategoriasConConteo()
    .where(estaActiva)
    .orderBy(ascendente(categorias.nombre));
}

// Categorías: alta, edición y baja.
export async function listarTodasLasCategorias(
  usuarioActual: UsuarioSesion
): Promise<Categoria[]> {
  exigirAdmin(usuarioActual);
  return seleccionarCategoriasConConteo().orderBy(
    ascendente(categorias.nombre)
  );
}

// Categorías: alta, edición y baja.
export async function listarCategorias(
  usuarioActual: UsuarioSesion,
  filtrosSinValidar: unknown
) {
  const { incluirInactivas } = esquemaFiltroCategorias.parse(filtrosSinValidar);
  if (incluirInactivas) return listarTodasLasCategorias(usuarioActual);
  return listarCategoriasActivas(usuarioActual);
}

// Alta y edición de productos: código único y existencia que no se edita a mano.
// Categorías: alta, edición y baja.
export async function listarOpcionesCategoria(
  _usuarioActual: UsuarioSesion
): Promise<OpcionCategoria[]> {
  return baseDeDatos
    .select({ valor: categorias.id, etiqueta: categorias.nombre })
    .from(categorias)
    .where(estaActiva)
    .orderBy(ascendente(categorias.nombre));
}

// Categorías: alta, edición y baja.
export async function crearCategoria(
  usuarioActual: UsuarioSesion,
  altaSinValidar: unknown
) {
  const { nombre } = esquemaAltaCategoria.parse(altaSinValidar);
  exigirAdmin(usuarioActual);
  await exigirNombreLibre(nombre);
  const [creada] = await baseDeDatos
    .insert(categorias)
    .values({ nombre })
    .returning(columnasCategoriaPublica);
  return creada;
}

// Categorías: alta, edición y baja.
export async function editarCategoria(
  usuarioActual: UsuarioSesion,
  idSinValidar: unknown,
  cambiosSinValidar: unknown
) {
  const categoriaId = esquemaId.parse(idSinValidar);
  const cambios = esquemaEdicionCategoria.parse(cambiosSinValidar);
  exigirAdmin(usuarioActual);
  await buscarCategoriaPorId(categoriaId);
  if (cambios.nombre) await exigirNombreLibre(cambios.nombre, categoriaId);
  if (cambios.activa === false)
    await exigirQueNoTengaProductosActivos(categoriaId);
  if (!hayCambios(cambios)) return buscarCategoriaPorId(categoriaId);
  const [editada] = await baseDeDatos
    .update(categorias)
    .set(cambios)
    .where(esIgualA(categorias.id, categoriaId))
    .returning(columnasCategoriaPublica);
  return editada;
}

// Alta y edición de productos: código único y existencia que no se edita a mano.
export async function exigirCategoriaActiva(categoriaId: number) {
  const cantidad = await baseDeDatos.$count(
    categorias,
    cumplenTodas(esIgualA(categorias.id, categoriaId), estaActiva)
  );
  if (cantidad > 0) return;
  throw crearError(ERRORES.VALIDACION, [
    {
      campo: esquemaAltaProducto.keyof().enum.categoriaId,
      mensaje: MENSAJES_VALIDACION.elegirCategoriaActiva,
    },
  ]);
}
