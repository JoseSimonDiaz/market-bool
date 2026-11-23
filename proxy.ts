import { NextResponse, type NextRequest } from 'next/server';
import { cuerpoDeError } from '@/adaptadores/errores-http';
import { ERRORES, type DefinicionError } from '@/constantes/errores';
import {
  ENDPOINTS_POR_ROL,
  ENDPOINTS_PUBLICOS,
  PAGINAS_POR_ROL,
  PAGINAS_PUBLICAS,
} from '@/constantes/permisos';
import { PREFIJO_API, RUTAS } from '@/constantes/rutas';
import { NOMBRE_COOKIE_SESION } from '@/constantes/seguridad';
import { endpointPermitido, paginaPermitida } from '@/lib/coincidencia-rutas';
import { leerSesionDelToken, type SesionDelToken } from '@/lib/token';

type PedidoAutorizable = {
  pedidoHttp: NextRequest;
  ruta: string;
  sesion: SesionDelToken | null;
};

function responderErrorDeApi(definicion: DefinicionError) {
  return NextResponse.json(cuerpoDeError(definicion), {
    status: definicion.status,
  });
}

function redirigirA(pedidoHttp: NextRequest, destino: string) {
  return NextResponse.redirect(new URL(destino, pedidoHttp.url));
}

function esPedidoPublico(ruta: string, metodo: string) {
  return (
    paginaPermitida(ruta, PAGINAS_PUBLICAS) ||
    endpointPermitido(ruta, metodo, ENDPOINTS_PUBLICOS)
  );
}

function autorizarApi({ pedidoHttp, ruta, sesion }: PedidoAutorizable) {
  if (!sesion) return responderErrorDeApi(ERRORES.NO_AUTENTICADO);
  const reglasDelRol = ENDPOINTS_POR_ROL[sesion.rol];
  if (!endpointPermitido(ruta, pedidoHttp.method, reglasDelRol)) {
    return responderErrorDeApi(ERRORES.SIN_PERMISO);
  }
  return NextResponse.next();
}

function autorizarPagina({ pedidoHttp, ruta, sesion }: PedidoAutorizable) {
  if (!sesion) return redirigirA(pedidoHttp, RUTAS.login);
  if (!paginaPermitida(ruta, PAGINAS_POR_ROL[sesion.rol])) {
    return redirigirA(pedidoHttp, RUTAS.sinPermiso);
  }
  return NextResponse.next();
}

export async function proxy(pedidoHttp: NextRequest) {
  const ruta = pedidoHttp.nextUrl.pathname;
  if (esPedidoPublico(ruta, pedidoHttp.method)) return NextResponse.next();
  const sesion = await leerSesionDelToken(
    pedidoHttp.cookies.get(NOMBRE_COOKIE_SESION)?.value
  );
  const pedido = { pedidoHttp, ruta, sesion };
  if (ruta.startsWith(PREFIJO_API)) return autorizarApi(pedido);
  return autorizarPagina(pedido);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
