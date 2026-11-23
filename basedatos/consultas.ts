import {
  and as cumplenTodas,
  eq as esIgualA,
  like as contienePatron,
  ne as esDistintoDe,
  or as cumpleAlguna,
} from 'drizzle-orm';
import type { SQLiteColumn, SQLiteTable } from 'drizzle-orm/sqlite-core';
import { baseDeDatos } from '@/basedatos/conexion';
import { ESTADO_FILTRO, type EstadoFiltro } from '@/constantes/dominio';
import { PRIMERA_PAGINA } from '@/constantes/url';

export type Paginado<Elemento> = {
  data: Elemento[];
  page: number;
  pageSize: number;
  total: number;
};

type TablaConId = SQLiteTable & { id: SQLiteColumn };

export type BusquedaDeDuplicado = {
  tabla: TablaConId;
  columna: SQLiteColumn;
  valorBuscado: string;
  idExcluido?: number;
};

export async function existeOtroRegistroConValor({
  tabla,
  columna,
  valorBuscado,
  idExcluido,
}: BusquedaDeDuplicado) {
  const excluirRegistroEditado = idExcluido
    ? esDistintoDe(tabla.id, idExcluido)
    : undefined;
  const coincidencias = await baseDeDatos.$count(
    tabla,
    cumplenTodas(esIgualA(columna, valorBuscado), excluirRegistroEditado)
  );
  return coincidencias > 0;
}

type PedidoDePagina<Fila> = {
  page: number;
  pageSize: number;
  total: Promise<number>;
  buscarFilas: (limite: number, desplazamiento: number) => Promise<Fila[]>;
};

export async function consultarPagina<Fila>({
  page,
  pageSize,
  total,
  buscarFilas,
}: PedidoDePagina<Fila>): Promise<Paginado<Fila>> {
  const filasSaltadas = (page - PRIMERA_PAGINA) * pageSize;
  const [filas, cantidadTotal] = await Promise.all([
    buscarFilas(pageSize, filasSaltadas),
    total,
  ]);
  return { data: filas, page, pageSize, total: cantidadTotal };
}

export function condicionDeEstado(
  columnaActivo: SQLiteColumn,
  estado: EstadoFiltro
) {
  if (estado === ESTADO_FILTRO.todos) return undefined;
  return esIgualA(columnaActivo, estado === ESTADO_FILTRO.activos);
}

export function condicionDeBusqueda(
  columnasDondeBuscar: SQLiteColumn[],
  textoBuscado?: string
) {
  if (!textoBuscado) return undefined;
  const patron = `%${textoBuscado}%`;
  return cumpleAlguna(
    ...columnasDondeBuscar.map((columna) => contienePatron(columna, patron))
  );
}
