import type { Metadata } from 'next';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { TablaUltimasFacturas } from '@/componentes/dominio/clientes/tabla-ultimas-facturas';
import { Pila, Titulo } from '@/componentes/primitivas';
import type { RUTAS_DE_ARCHIVO } from '@/constantes/rutas';
import { listarUltimasFacturasDelCliente } from '@/servicios/clientes';

export const metadata: Metadata = { title: 'Ficha del cliente' };

export default async function PaginaCliente({
  params,
}: PageProps<typeof RUTAS_DE_ARCHIVO.cliente>) {
  const usuario = await usuarioDePaginaOLogin();
  const { id } = await params;
  const ultimasFacturas = await listarUltimasFacturasDelCliente(usuario, id);

  return (
    <Pila espacio={4}>
      <Titulo nivel={2}>Últimas facturas</Titulo>
      <TablaUltimasFacturas facturas={ultimasFacturas} />
    </Pila>
  );
}
