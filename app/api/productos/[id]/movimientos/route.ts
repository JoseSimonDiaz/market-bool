import { ESTADO_HTTP } from '@/constantes/http';
import { ruta } from '@/adaptadores/rutas';
import {
  listarMovimientosProducto,
  registrarMovimientoManual,
} from '@/servicios/stock';

export const GET = ruta<{ id: string }>(
  ({ usuarioActual, parametros, filtros }) =>
    listarMovimientosProducto(usuarioActual, parametros.id, filtros)
);

export const POST = ruta<{ id: string }>(
  ({ usuarioActual, parametros, cuerpo }) =>
    registrarMovimientoManual(usuarioActual, parametros.id, cuerpo),
  { estado: ESTADO_HTTP.creado }
);
