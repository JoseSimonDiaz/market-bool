import { ruta } from '@/adaptadores/rutas';
import { ESTADO_HTTP } from '@/constantes/http';
import { listarFacturas } from '@/servicios/facturas';
import { emitirFactura } from '@/servicios/ventas';

export const GET = ruta(({ usuarioActual, filtros }) =>
  listarFacturas(usuarioActual, filtros)
);

export const POST = ruta(
  ({ usuarioActual, cuerpo }) => emitirFactura(usuarioActual, cuerpo),
  { estado: ESTADO_HTTP.creado }
);
