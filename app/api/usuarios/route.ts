import { ESTADO_HTTP } from '@/constantes/http';
import { ruta } from '@/adaptadores/rutas';
import { crearUsuario, listarUsuarios } from '@/servicios/usuarios';

export const GET = ruta(({ usuarioActual, filtros }) =>
  listarUsuarios(usuarioActual, filtros)
);

export const POST = ruta(
  ({ usuarioActual, cuerpo }) => crearUsuario(usuarioActual, cuerpo),
  {
    estado: ESTADO_HTTP.creado,
  }
);
