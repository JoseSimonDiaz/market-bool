import { ESTADO_HTTP } from '@/constantes/http';
import { ruta } from '@/adaptadores/rutas';
import { crearCategoria, listarCategorias } from '@/servicios/categorias';

export const GET = ruta(({ usuarioActual, filtros }) =>
  listarCategorias(usuarioActual, filtros)
);

export const POST = ruta(
  ({ usuarioActual, cuerpo }) => crearCategoria(usuarioActual, cuerpo),
  {
    estado: ESTADO_HTTP.creado,
  }
);
