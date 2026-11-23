import { NextResponse, type NextRequest } from 'next/server';
import {
  traducirErrorAHttp,
  type CuerpoError,
} from '@/adaptadores/errores-http';
import { exigirUsuario } from '@/adaptadores/sesion';
import { ERRORES } from '@/constantes/errores';
import {
  CUERPO_VACIO,
  ESTADO_HTTP,
  METODOS_CON_CUERPO,
} from '@/constantes/http';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { crearError } from '@/servicios/errores';

type ParametrosDeRuta = Record<string, string>;

export type ContextoRuta<Parametros extends ParametrosDeRuta> = {
  usuarioActual: UsuarioSesion;
  parametros: Parametros;
  cuerpo: unknown;
  filtros: Record<string, string>;
};

type OpcionesRuta = { estado?: number };

async function leerCuerpoJson(pedidoHttp: NextRequest): Promise<unknown> {
  if (!METODOS_CON_CUERPO.has(pedidoHttp.method)) return CUERPO_VACIO;
  const cuerpoEnTexto = await pedidoHttp.text();
  if (!cuerpoEnTexto) return CUERPO_VACIO;
  try {
    return JSON.parse(cuerpoEnTexto);
  } catch (_jsonMalFormado) {
    throw crearError(ERRORES.JSON_INVALIDO);
  }
}

function responder(respuestaDelServicio: unknown, estado: number) {
  if (estado === ESTADO_HTTP.sinContenido) {
    return new Response(null, { status: estado });
  }
  return NextResponse.json(respuestaDelServicio, { status: estado });
}

function responderError(error: unknown) {
  const { status, cuerpo } = traducirErrorAHttp(error);
  return NextResponse.json<CuerpoError>(cuerpo, { status });
}

async function armarContexto<Parametros extends ParametrosDeRuta>(
  pedidoHttp: NextRequest,
  parametrosDeNext: Promise<Parametros>
): Promise<ContextoRuta<Parametros>> {
  return {
    usuarioActual: await exigirUsuario(),
    parametros: await parametrosDeNext,
    cuerpo: await leerCuerpoJson(pedidoHttp),
    filtros: Object.fromEntries(pedidoHttp.nextUrl.searchParams),
  };
}

export function ruta<Parametros extends ParametrosDeRuta = ParametrosDeRuta>(
  manejador: (contexto: ContextoRuta<Parametros>) => Promise<unknown>,
  { estado = ESTADO_HTTP.ok }: OpcionesRuta = {}
) {
  return async (
    pedidoHttp: NextRequest,
    contextoDeNext: { params: Promise<Parametros> }
  ): Promise<Response> => {
    try {
      const contexto = await armarContexto(pedidoHttp, contextoDeNext.params);
      return responder(await manejador(contexto), estado);
    } catch (error) {
      return responderError(error);
    }
  };
}

export function rutaPublica(
  manejador: (contexto: { cuerpo: unknown }) => Promise<unknown>
) {
  return async (pedidoHttp: NextRequest): Promise<Response> => {
    try {
      const cuerpo = await leerCuerpoJson(pedidoHttp);
      return responder(await manejador({ cuerpo }), ESTADO_HTTP.ok);
    } catch (error) {
      return responderError(error);
    }
  };
}
