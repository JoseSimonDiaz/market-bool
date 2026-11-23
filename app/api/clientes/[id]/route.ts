import { ruta } from '@/adaptadores/rutas';
import { editarCliente, obtenerCliente } from '@/servicios/clientes';

export const GET = ruta<{ id: string }>(({ usuarioActual, parametros }) =>
  obtenerCliente(usuarioActual, parametros.id)
);

export const PATCH = ruta<{ id: string }>(
  ({ usuarioActual, parametros, cuerpo }) =>
    editarCliente(usuarioActual, parametros.id, cuerpo)
);
