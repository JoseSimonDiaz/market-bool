import { ruta } from '@/adaptadores/rutas';
import { obtenerTablero } from '@/servicios/tablero';

export const GET = ruta(({ usuarioActual }) => obtenerTablero(usuarioActual));
