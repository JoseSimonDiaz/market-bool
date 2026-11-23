import { ESTADO_HTTP } from '@/constantes/http';
import { ruta } from '@/adaptadores/rutas';
import { cambiarPassword } from '@/servicios/auth';

export const PUT = ruta(
  ({ usuarioActual, cuerpo }) => cambiarPassword(usuarioActual, cuerpo),
  {
    estado: ESTADO_HTTP.sinContenido,
  }
);
