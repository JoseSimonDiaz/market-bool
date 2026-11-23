import { ESTADO_HTTP } from '@/constantes/http';
import { ruta } from '@/adaptadores/rutas';
import { crearProducto, listarProductos } from '@/servicios/productos';

export const GET = ruta(({ usuarioActual, filtros }) =>
  listarProductos(usuarioActual, filtros)
);

export const POST = ruta(
  ({ usuarioActual, cuerpo }) => crearProducto(usuarioActual, cuerpo),
  {
    estado: ESTADO_HTTP.creado,
  }
);
