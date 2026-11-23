import type { Metadata } from 'next';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { FiltroUrl } from '@/componentes/comunes/filtros/filtro-url';
import { Paginador } from '@/componentes/comunes/paginador';
import { TablaMovimientos } from '@/componentes/dominio/productos/tabla-movimientos';
import { Fila, Pila } from '@/componentes/primitivas';
import { OPCIONES_TIPO_MOVIMIENTO } from '@/constantes/opciones';
import { PARAMETRO_URL } from '@/constantes/url';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { listarMovimientos } from '@/servicios/stock';
import type { RUTAS } from '@/constantes/rutas';

export const metadata: Metadata = { title: 'Existencias' };

export default async function PaginaExistencias({
  searchParams,
}: PageProps<typeof RUTAS.existencias>) {
  const usuario = await usuarioDePaginaOLogin();
  const pagina = await listarMovimientos(usuario, await searchParams);

  return (
    <Pila espacio={6}>
      <EncabezadoPagina
        titulo="Existencias"
        descripcion="Historial de ventas, anulaciones, ingresos y egresos de stock."
      />
      <Fila>
        <FiltroUrl
          parametro={PARAMETRO_URL.tipo}
          opciones={OPCIONES_TIPO_MOVIMIENTO}
          etiquetaSinFiltro="Todos los tipos"
        />
      </Fila>
      <TablaMovimientos movimientos={pagina.data} mostrarProducto />
      <Paginador
        page={pagina.page}
        pageSize={pagina.pageSize}
        total={pagina.total}
      />
    </Pila>
  );
}
