import { ruta } from '@/adaptadores/rutas';
import { obtenerFactura } from '@/servicios/facturas';

export const GET = ruta<{ id: string }>(({ usuarioActual, parametros }) =>
  obtenerFactura(usuarioActual, parametros.id)
);
