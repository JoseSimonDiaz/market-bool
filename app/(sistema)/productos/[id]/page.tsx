import type { Metadata } from 'next';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { Paginador } from '@/componentes/comunes/paginador';
import { AccionesProducto } from '@/componentes/dominio/productos/acciones-producto';
import { FichaProducto } from '@/componentes/dominio/productos/ficha-producto';
import { TablaMovimientos } from '@/componentes/dominio/productos/tabla-movimientos';
import { Pila, Titulo } from '@/componentes/primitivas';
import { cargarOMostrarNoEncontrado } from '@/adaptadores/paginas';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { listarOpcionesCategoria } from '@/servicios/categorias';
import { esAdmin } from '@/servicios/permisos';
import { obtenerProducto } from '@/servicios/productos';
import { listarMovimientosProducto } from '@/servicios/stock';
import type { RUTAS_DE_ARCHIVO } from '@/constantes/rutas';

export const metadata: Metadata = { title: 'Ficha del producto' };

export default async function PaginaProducto({
  params,
  searchParams,
}: PageProps<typeof RUTAS_DE_ARCHIVO.producto>) {
  const usuario = await usuarioDePaginaOLogin();
  const { id } = await params;
  const producto = await cargarOMostrarNoEncontrado(() =>
    obtenerProducto(usuario, id)
  );
  const [movimientos, categorias] = await Promise.all([
    listarMovimientosProducto(usuario, id, await searchParams),
    listarOpcionesCategoria(usuario),
  ]);
  const accionesDeAdmin = esAdmin(usuario) && (
    <AccionesProducto producto={producto} categorias={categorias} />
  );

  return (
    <Pila espacio={6}>
      <EncabezadoPagina
        titulo={producto.descripcion}
        descripcion={`${producto.codigo} · ${producto.categoria.nombre}`}
        acciones={accionesDeAdmin}
      />
      <FichaProducto producto={producto} />
      <Titulo nivel={2}>Movimientos</Titulo>
      <TablaMovimientos
        movimientos={movimientos.data}
        mostrarProducto={false}
      />
      <Paginador
        page={movimientos.page}
        pageSize={movimientos.pageSize}
        total={movimientos.total}
      />
    </Pila>
  );
}
