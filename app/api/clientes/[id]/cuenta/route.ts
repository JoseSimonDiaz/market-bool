import { ruta } from '@/adaptadores/rutas';
import { consultarCuentaCorriente } from '@/servicios/cuenta-corriente';

export const GET = ruta<{ id: string }>(
  ({ usuarioActual, parametros, filtros }) =>
    consultarCuentaCorriente(usuarioActual, parametros.id, filtros)
);
