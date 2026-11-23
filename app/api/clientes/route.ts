import { ESTADO_HTTP } from '@/constantes/http';
import { ruta } from '@/adaptadores/rutas';
import { crearCliente, listarClientes } from '@/servicios/clientes';

export const GET = ruta(({ usuarioActual, filtros }) =>
  listarClientes(usuarioActual, filtros)
);

export const POST = ruta(
  ({ usuarioActual, cuerpo }) => crearCliente(usuarioActual, cuerpo),
  { estado: ESTADO_HTTP.creado }
);
