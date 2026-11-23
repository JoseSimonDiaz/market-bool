import { cargarOMostrarNoEncontrado } from '@/adaptadores/paginas';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { PestaniasDeNavegacion } from '@/componentes/comunes/pestanias-de-navegacion';
import { AccionesCliente } from '@/componentes/dominio/clientes/acciones-cliente';
import { FichaCliente } from '@/componentes/dominio/clientes/ficha-cliente';
import { Pila } from '@/componentes/primitivas';
import { pestaniasDeFichaCliente } from '@/constantes/navegacion';
import type { RUTAS_DE_ARCHIVO } from '@/constantes/rutas';
import { obtenerDatosCliente } from '@/servicios/clientes';

export default async function LayoutFichaCliente({
  params,
  children,
}: LayoutProps<typeof RUTAS_DE_ARCHIVO.cliente>) {
  const usuario = await usuarioDePaginaOLogin();
  const { id } = await params;
  const cliente = await cargarOMostrarNoEncontrado(() =>
    obtenerDatosCliente(usuario, id)
  );
  const documento = `${cliente.tipoDoc} ${cliente.nroDoc}`;

  return (
    <Pila espacio={6}>
      <EncabezadoPagina
        titulo={cliente.nombre}
        descripcion={documento}
        acciones={<AccionesCliente cliente={cliente} />}
      />
      <FichaCliente cliente={cliente} />
      <PestaniasDeNavegacion
        pestanias={pestaniasDeFichaCliente(cliente.id)}
        descripcion="Secciones del cliente"
      />
      {children}
    </Pila>
  );
}
