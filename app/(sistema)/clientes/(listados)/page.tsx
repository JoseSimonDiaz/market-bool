import type { Metadata } from 'next';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { BuscadorUrl } from '@/componentes/comunes/filtros/buscador-url';
import { Paginador } from '@/componentes/comunes/paginador';
import { BotonNuevoCliente } from '@/componentes/dominio/clientes/boton-nuevo-cliente';
import { TablaClientes } from '@/componentes/dominio/clientes/tabla-clientes';
import { Pila } from '@/componentes/primitivas';
import type { RUTAS } from '@/constantes/rutas';
import { listarClientes } from '@/servicios/clientes';

export const metadata: Metadata = { title: 'Clientes' };

export default async function PaginaClientes({
  searchParams,
}: PageProps<typeof RUTAS.clientes>) {
  const usuario = await usuarioDePaginaOLogin();
  const pagina = await listarClientes(usuario, await searchParams);

  return (
    <Pila espacio={6}>
      <EncabezadoPagina
        titulo="Clientes"
        descripcion="Compradores registrados y el saldo de su cuenta corriente."
        acciones={<BotonNuevoCliente />}
      />
      <BuscadorUrl placeholder="Buscar por nombre o documento" />
      <TablaClientes clientes={pagina.data} />
      <Paginador
        page={pagina.page}
        pageSize={pagina.pageSize}
        total={pagina.total}
      />
    </Pila>
  );
}
