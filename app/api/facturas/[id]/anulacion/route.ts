import { ruta } from '@/adaptadores/rutas';
import { anularFactura } from '@/servicios/anulaciones';

export const POST = ruta<{ id: string }>(
  ({ usuarioActual, parametros, cuerpo }) =>
    anularFactura(usuarioActual, parametros.id, cuerpo)
);
