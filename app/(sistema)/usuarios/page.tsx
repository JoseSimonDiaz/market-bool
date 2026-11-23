import type { Metadata } from 'next';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { BuscadorUrl } from '@/componentes/comunes/filtros/buscador-url';
import { FiltroUrl } from '@/componentes/comunes/filtros/filtro-url';
import { Paginador } from '@/componentes/comunes/paginador';
import { BotonNuevoUsuario } from '@/componentes/dominio/usuarios/boton-nuevo-usuario';
import { TablaUsuarios } from '@/componentes/dominio/usuarios/tabla-usuarios';
import { Fila, Pila } from '@/componentes/primitivas';
import { OPCIONES_ESTADO_SI_POR_DEFECTO_TODOS } from '@/constantes/opciones';
import { PARAMETRO_URL } from '@/constantes/url';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { listarUsuarios } from '@/servicios/usuarios';
import type { RUTAS } from '@/constantes/rutas';

export const metadata: Metadata = { title: 'Usuarios' };

export default async function PaginaUsuarios({
  searchParams,
}: PageProps<typeof RUTAS.usuarios>) {
  const usuario = await usuarioDePaginaOLogin();
  const pagina = await listarUsuarios(usuario, await searchParams);

  return (
    <Pila espacio={6}>
      <EncabezadoPagina
        titulo="Usuarios"
        descripcion="Personal con acceso al sistema y su rol."
        acciones={<BotonNuevoUsuario />}
      />
      <Fila>
        <BuscadorUrl placeholder="Buscar por nombre o email" />
        <FiltroUrl
          parametro={PARAMETRO_URL.estado}
          opciones={OPCIONES_ESTADO_SI_POR_DEFECTO_TODOS}
          etiquetaSinFiltro="Todos los estados"
        />
      </Fila>
      <TablaUsuarios usuarios={pagina.data} usuarioActualId={usuario.id} />
      <Paginador
        page={pagina.page}
        pageSize={pagina.pageSize}
        total={pagina.total}
      />
    </Pila>
  );
}
