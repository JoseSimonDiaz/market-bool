import { ruta } from '@/adaptadores/rutas';
import { editarProducto, obtenerProducto } from '@/servicios/productos';

export const GET = ruta<{ id: string }>(({ usuarioActual, parametros }) =>
  obtenerProducto(usuarioActual, parametros.id)
);

export const PATCH = ruta<{ id: string }>(
  ({ usuarioActual, parametros, cuerpo }) =>
    editarProducto(usuarioActual, parametros.id, cuerpo)
);
