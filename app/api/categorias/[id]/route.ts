import { ruta } from '@/adaptadores/rutas';
import { editarCategoria } from '@/servicios/categorias';

export const PATCH = ruta<{ id: string }>(
  ({ usuarioActual, parametros, cuerpo }) =>
    editarCategoria(usuarioActual, parametros.id, cuerpo)
);
