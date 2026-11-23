import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { Pila, Texto } from '@/componentes/primitivas';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';

export default async function PaginaInicio() {
  const usuario = await usuarioDePaginaOLogin();

  return (
    <Pila espacio={6}>
      <EncabezadoPagina
        titulo={`Hola, ${usuario.nombre}`}
        descripcion="Bienvenido a market-bool."
      />
      <Texto tono="suave">
        Desde el panel lateral podés gestionar el catálogo de cartas y sobres.
      </Texto>
    </Pila>
  );
}
