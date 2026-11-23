import { ruta } from '@/adaptadores/rutas';
import { restablecerPassword } from '@/servicios/usuarios';

export const POST = ruta<{ id: string }>(({ usuarioActual, parametros }) =>
  restablecerPassword(usuarioActual, parametros.id)
);
