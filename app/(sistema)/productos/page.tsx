import type { Metadata } from 'next';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { BuscadorUrl } from '@/componentes/comunes/filtros/buscador-url';
import { FiltroBooleanoUrl } from '@/componentes/comunes/filtros/filtro-booleano-url';
import { FiltroUrl } from '@/componentes/comunes/filtros/filtro-url';
import { Paginador } from '@/componentes/comunes/paginador';
import { BotonNuevoProducto } from '@/componentes/dominio/productos/boton-nuevo-producto';
import { TablaProductos } from '@/componentes/dominio/productos/tabla-productos';
import { Fila, Pila } from '@/componentes/primitivas';
import { OPCIONES_ESTADO_SI_POR_DEFECTO_ACTIVOS } from '@/constantes/opciones';
import { PARAMETRO_URL } from '@/constantes/url';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { listarOpcionesCategoria } from '@/servicios/categorias';
import { esAdmin } from '@/servicios/permisos';
import { listarProductos } from '@/servicios/productos';
import type { RUTAS } from '@/constantes/rutas';

export const metadata: Metadata = { title: 'Productos' };

export default async function PaginaProductos({
  searchParams,
}: PageProps<typeof RUTAS.productos>) {
  const usuario = await usuarioDePaginaOLogin();
  const admin = esAdmin(usuario);
  const [pagina, categorias] = await Promise.all([
    listarProductos(usuario, await searchParams),
    listarOpcionesCategoria(usuario),
  ]);
  const botonNuevoProducto = admin && (
    <BotonNuevoProducto categorias={categorias} />
  );

  return (
    <Pila espacio={6}>
      <EncabezadoPagina
        titulo="Catálogo"
        descripcion="Cartas sueltas, sobres y accesorios a la venta."
        acciones={botonNuevoProducto}
      />
      <Fila espacio={3}>
        <BuscadorUrl placeholder="Buscar por código o descripción" />
        <FiltroUrl
          parametro={PARAMETRO_URL.categoria}
          opciones={categorias}
          etiquetaSinFiltro="Todas las categorías"
        />
        {admin && (
          <FiltroUrl
            parametro={PARAMETRO_URL.activo}
            opciones={OPCIONES_ESTADO_SI_POR_DEFECTO_ACTIVOS}
            etiquetaSinFiltro="Solo activos"
          />
        )}
        <FiltroBooleanoUrl
          parametro={PARAMETRO_URL.bajoMinimo}
          etiqueta="Solo bajo el mínimo"
        />
      </Fila>
      <TablaProductos productos={pagina.data} mostrarEstado={admin} />
      <Paginador
        page={pagina.page}
        pageSize={pagina.pageSize}
        total={pagina.total}
      />
    </Pila>
  );
}
