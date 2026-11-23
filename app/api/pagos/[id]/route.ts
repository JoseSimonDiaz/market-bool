import { ruta } from '@/adaptadores/rutas';
import { obtenerPago } from '@/servicios/pagos';

export const GET = ruta<{ id: string }>(({ usuarioActual, parametros }) =>
  obtenerPago(usuarioActual, parametros.id)
);
