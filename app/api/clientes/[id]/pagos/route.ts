import { ESTADO_HTTP } from '@/constantes/http';
import { ruta } from '@/adaptadores/rutas';
import { registrarPago } from '@/servicios/pagos';

export const POST = ruta<{ id: string }>(
  ({ usuarioActual, parametros, cuerpo }) =>
    registrarPago(usuarioActual, parametros.id, cuerpo),
  { estado: ESTADO_HTTP.creado }
);
