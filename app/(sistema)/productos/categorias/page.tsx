import type { Metadata } from 'next';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { BotonNuevaCategoria } from '@/componentes/dominio/productos/categorias/boton-nueva-categoria';
import { TablaCategorias } from '@/componentes/dominio/productos/categorias/tabla-categorias';
import { Pila } from '@/componentes/primitivas';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import {
  listarCategoriasActivas,
  listarTodasLasCategorias,
} from '@/servicios/categorias';
import { esAdmin } from '@/servicios/permisos';

export const metadata: Metadata = { title: 'Categorías' };

export default async function PaginaCategorias() {
  const usuario = await usuarioDePaginaOLogin();
  const admin = esAdmin(usuario);
  const categorias = admin
    ? await listarTodasLasCategorias(usuario)
    : await listarCategoriasActivas(usuario);
  const botonNuevaCategoria = admin && <BotonNuevaCategoria />;

  return (
    <Pila espacio={6}>
      <EncabezadoPagina
        titulo="Categorías"
        descripcion="Expansiones y tipos de producto del catálogo."
        acciones={botonNuevaCategoria}
      />
      <TablaCategorias categorias={categorias} mostrarAcciones={admin} />
    </Pila>
  );
}
