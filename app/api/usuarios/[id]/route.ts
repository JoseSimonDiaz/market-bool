import { ruta } from '@/adaptadores/rutas';
import { editarUsuario } from '@/servicios/usuarios';

export const PATCH = ruta<{ id: string }>(
  ({ usuarioActual, parametros, cuerpo }) =>
    editarUsuario(usuarioActual, parametros.id, cuerpo)
);
