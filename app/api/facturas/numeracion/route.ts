import { ruta } from '@/adaptadores/rutas';
import { consultarProximoNumero } from '@/servicios/facturas';

export const GET = ruta(({ usuarioActual }) =>
  consultarProximoNumero(usuarioActual)
);
