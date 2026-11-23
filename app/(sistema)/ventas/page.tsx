import { PlusIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { BotonEnlace } from '@/componentes/comunes/boton-enlace';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { BuscadorUrl } from '@/componentes/comunes/filtros/buscador-url';
import { FiltroFechaUrl } from '@/componentes/comunes/filtros/filtro-fecha-url';
import { FiltroUrl } from '@/componentes/comunes/filtros/filtro-url';
import { Paginador } from '@/componentes/comunes/paginador';
import { TablaFacturas } from '@/componentes/dominio/ventas/tabla-facturas';
import { Fila, Pila } from '@/componentes/primitivas';
import {
  OPCIONES_ESTADO_FACTURA,
  OPCIONES_FORMA_PAGO,
} from '@/constantes/opciones';
import { RUTAS } from '@/constantes/rutas';
import { PARAMETRO_URL } from '@/constantes/url';
import { formatearMoneda } from '@/lib/formato';
import { listarFacturas } from '@/servicios/facturas';
import { listarOpcionesCliente } from '@/servicios/clientes';
import { listarOpcionesVendedor } from '@/servicios/usuarios';

export const metadata: Metadata = { title: 'Ventas' };

export default async function PaginaVentas({
  searchParams,
}: PageProps<typeof RUTAS.ventas>) {
  const usuario = await usuarioDePaginaOLogin();
  const [pagina, clientes, vendedores] = await Promise.all([
    listarFacturas(usuario, await searchParams),
    listarOpcionesCliente(usuario),
    listarOpcionesVendedor(usuario),
  ]);
  const totalEmitido = `Total emitido: ${formatearMoneda(pagina.totalEmitido)}`;
  const botonNuevaVenta = (
    <BotonEnlace destino={RUTAS.nuevaVenta}>
      <PlusIcon />
      Nueva venta
    </BotonEnlace>
  );

  return (
    <Pila espacio={6}>
      <EncabezadoPagina
        titulo="Ventas"
        descripcion={totalEmitido}
        acciones={botonNuevaVenta}
      />
      <Fila espacio={3}>
        <BuscadorUrl placeholder="Buscar por número o cliente" />
        <FiltroFechaUrl parametro={PARAMETRO_URL.desde} etiqueta="Desde" />
        <FiltroFechaUrl parametro={PARAMETRO_URL.hasta} etiqueta="Hasta" />
        <FiltroUrl
          parametro={PARAMETRO_URL.cliente}
          opciones={clientes}
          etiquetaSinFiltro="Todos los clientes"
        />
        <FiltroUrl
          parametro={PARAMETRO_URL.forma}
          opciones={OPCIONES_FORMA_PAGO}
          etiquetaSinFiltro="Todas las formas de pago"
        />
        <FiltroUrl
          parametro={PARAMETRO_URL.vendedor}
          opciones={vendedores}
          etiquetaSinFiltro="Todos los vendedores"
        />
        <FiltroUrl
          parametro={PARAMETRO_URL.estado}
          opciones={OPCIONES_ESTADO_FACTURA}
          etiquetaSinFiltro="Emitidas y anuladas"
        />
      </Fila>
      <TablaFacturas facturas={pagina.data} />
      <Paginador
        page={pagina.page}
        pageSize={pagina.pageSize}
        total={pagina.total}
      />
    </Pila>
  );
}
