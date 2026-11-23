import type { Metadata } from 'next';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { Paginador } from '@/componentes/comunes/paginador';
import { TablaClientes } from '@/componentes/dominio/clientes/tabla-clientes';
import { Pila } from '@/componentes/primitivas';
import type { RUTAS } from '@/constantes/rutas';
import { formatearMoneda } from '@/lib/formato';
import { listarDeudores } from '@/servicios/clientes';

export const metadata: Metadata = { title: 'Saldos' };

export default async function PaginaSaldos({
  searchParams,
}: PageProps<typeof RUTAS.saldos>) {
  const usuario = await usuarioDePaginaOLogin();
  const pagina = await listarDeudores(usuario, await searchParams);
  const totalAdeudado = `Total adeudado: ${formatearMoneda(pagina.totalAdeudado)}`;

  return (
    <Pila espacio={6}>
      <EncabezadoPagina titulo="Saldos" descripcion={totalAdeudado} />
      <TablaClientes clientes={pagina.data} />
      <Paginador
        page={pagina.page}
        pageSize={pagina.pageSize}
        total={pagina.total}
      />
    </Pila>
  );
}
