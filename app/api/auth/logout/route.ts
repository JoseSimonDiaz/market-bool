import { ESTADO_HTTP } from '@/constantes/http';
import { ruta } from '@/adaptadores/rutas';
import { cerrarSesion } from '@/adaptadores/sesion';

export const POST = ruta(cerrarSesion, { estado: ESTADO_HTTP.sinContenido });
