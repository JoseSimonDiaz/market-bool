import { ruta } from '@/adaptadores/rutas';
import { listarMovimientos } from '@/servicios/stock';

export const GET = ruta(({ usuarioActual, filtros }) =>
  listarMovimientos(usuarioActual, filtros)
);
