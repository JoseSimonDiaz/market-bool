import {
  and as cumplenTodas,
  asc as ascendente,
  count as contarFilas,
  desc as descendente,
  eq as esIgualA,
  gt as esMayorQue,
  or as cumpleAlguna,
  sql as expresionSql,
  type SQL,
} from 'drizzle-orm';
import { baseDeDatos } from '@/basedatos/conexion';
import {
  condicionDeBusqueda,
  condicionDeEstado,
  consultarPagina,
  type Paginado,
} from '@/basedatos/consultas';
import { clientes, facturas } from '@/basedatos/esquema';
import {
  saldoDelCliente,
  saldosPorCliente,
  uneSaldoConCliente,
} from '@/basedatos/saldos';
import {
  CANTIDAD_ULTIMAS_FACTURAS,
  ORDEN_CLIENTES,
  SALDO_SALDADO,
} from '@/constantes/dominio';
import { ERRORES } from '@/constantes/errores';
import {
  esquemaAltaCliente,
  esquemaEdicionCliente,
  esquemaFiltroClientes,
  type FiltroClientes,
} from '@/esquemas/clientes';
import { esquemaId } from '@/esquemas/comunes';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import {
  formatearDocumento,
  formatearNumeroComprobante,
  soloDigitos,
} from '@/lib/formato';
import { crearError } from '@/servicios/errores';
import { exigirValorUnico, hayCambios } from '@/servicios/reglas-comunes';

const disponibleDelCliente = expresionSql<
  number | null
>`${clientes.limiteCredito} - ${saldoDelCliente}`;

const columnasCliente = {
  id: clientes.id,
  tipoDoc: clientes.tipoDoc,
  nroDocDigitos: clientes.nroDocDigitos,
  nombre: clientes.nombre,
  domicilio: clientes.domicilio,
  telefono: clientes.telefono,
  email: clientes.email,
  cuentaCorriente: clientes.cuentaCorriente,
  limiteCredito: clientes.limiteCredito,
  saldo: saldoDelCliente,
  disponible: disponibleDelCliente,
  activo: clientes.activo,
};

const ORDENAMIENTO_DE_CLIENTES = {
  [ORDEN_CLIENTES.nombre]: [
    ascendente(clientes.nombre),
    ascendente(clientes.id),
  ],
  [ORDEN_CLIENTES.saldo]: [
    descendente(saldoDelCliente),
    ascendente(clientes.nombre),
    ascendente(clientes.id),
  ],
};

const seleccionarClientes = () =>
  baseDeDatos
    .select(columnasCliente)
    .from(clientes)
    .leftJoin(saldosPorCliente, uneSaldoConCliente);

type FilaCliente = Awaited<ReturnType<typeof seleccionarClientes>>[number];

export type Cliente = Omit<FilaCliente, 'nroDocDigitos'> & { nroDoc: string };

export type ListadoClientes = Paginado<Cliente> & { totalAdeudado?: number };

function aCliente({ nroDocDigitos, ...cliente }: FilaCliente): Cliente {
  return {
    ...cliente,
    nroDoc: formatearDocumento(cliente.tipoDoc, nroDocDigitos),
  };
}

function condicionDeBusquedaDeCliente(textoBuscado?: string) {
  if (!textoBuscado) return undefined;
  return cumpleAlguna(
    condicionDeBusqueda([clientes.nombre], textoBuscado),
    condicionDeBusqueda([clientes.nroDocDigitos], soloDigitos(textoBuscado))
  );
}

function condicionesDeClientes(filtros: FiltroClientes) {
  return cumplenTodas(
    condicionDeEstado(clientes.activo, filtros.estado),
    condicionDeBusquedaDeCliente(filtros.q),
    filtros.conDeuda ? esMayorQue(saldoDelCliente, SALDO_SALDADO) : undefined
  );
}

async function resumirClientes(condiciones: SQL | undefined) {
  const [resumen] = await baseDeDatos
    .select({
      cantidad: contarFilas(),
      totalAdeudado:
        expresionSql<number>`coalesce(sum(${saldoDelCliente}), ${SALDO_SALDADO})`.mapWith(
          Number
        ),
    })
    .from(clientes)
    .leftJoin(saldosPorCliente, uneSaldoConCliente)
    .where(condiciones);
  return resumen;
}

function buscarFilasDeClientes(
  condiciones: SQL | undefined,
  filtros: FiltroClientes
) {
  return async (limite: number, desplazamiento: number) => {
    const filas = await seleccionarClientes()
      .where(condiciones)
      .orderBy(...ORDENAMIENTO_DE_CLIENTES[filtros.orden])
      .limit(limite)
      .offset(desplazamiento);
    return filas.map(aCliente);
  };
}

function exigirDocumentoLibre(nroDocDigitos: string, idExcluido?: number) {
  return exigirValorUnico({
    tabla: clientes,
    columna: clientes.nroDocDigitos,
    valorBuscado: nroDocDigitos,
    idExcluido,
    errorSiExiste: ERRORES.DOCUMENTO_DUPLICADO,
    campo: esquemaAltaCliente.keyof().enum.nroDoc,
  });
}

export async function buscarCliente(clienteId: number) {
  const [cliente] = await seleccionarClientes().where(
    esIgualA(clientes.id, clienteId)
  );
  if (!cliente) throw crearError(ERRORES.NO_ENCONTRADO);
  return aCliente(cliente);
}

async function listarUltimasFacturas(clienteId: number) {
  const ultimas = await baseDeDatos
    .select({
      id: facturas.id,
      puntoVenta: facturas.puntoVenta,
      numero: facturas.numero,
      fecha: facturas.fecha,
      total: facturas.total,
      formaPago: facturas.formaPago,
      estado: facturas.estado,
    })
    .from(facturas)
    .where(esIgualA(facturas.clienteId, clienteId))
    .orderBy(descendente(facturas.fecha), descendente(facturas.id))
    .limit(CANTIDAD_ULTIMAS_FACTURAS);
  return ultimas.map(({ puntoVenta, numero, ...factura }) => ({
    ...factura,
    numero: formatearNumeroComprobante(puntoVenta, numero),
  }));
}

// Listado de clientes: búsqueda por nombre o documento, con el saldo de cada uno.
// Saldos: los clientes con deuda, de mayor a menor, con el total adeudado.
export async function listarClientes(
  _usuarioActual: UsuarioSesion,
  filtrosSinValidar: unknown
): Promise<ListadoClientes> {
  const filtros = esquemaFiltroClientes.parse(filtrosSinValidar);
  const condiciones = condicionesDeClientes(filtros);
  const resumen = resumirClientes(condiciones);
  const pagina = await consultarPagina({
    page: filtros.page,
    pageSize: filtros.pageSize,
    total: resumen.then(({ cantidad }) => cantidad),
    buscarFilas: buscarFilasDeClientes(condiciones, filtros),
  });
  if (!filtros.conDeuda) return pagina;
  return { ...pagina, totalAdeudado: (await resumen).totalAdeudado };
}

// Ficha del cliente: sus datos, el saldo actual y las últimas facturas.
export async function obtenerCliente(
  _usuarioActual: UsuarioSesion,
  idSinValidar: unknown
) {
  const clienteId = esquemaId.parse(idSinValidar);
  const [cliente, ultimasFacturas] = await Promise.all([
    buscarCliente(clienteId),
    listarUltimasFacturas(clienteId),
  ]);
  return { ...cliente, ultimasFacturas };
}

export type FichaDeCliente = Awaited<ReturnType<typeof obtenerCliente>>;

// Alta y edición de clientes: documento único, cuenta corriente y límite de crédito opcional.
export async function crearCliente(
  _usuarioActual: UsuarioSesion,
  altaSinValidar: unknown
): Promise<Cliente> {
  const { nroDoc, ...alta } = esquemaAltaCliente.parse(altaSinValidar);
  await exigirDocumentoLibre(nroDoc);
  const [creado] = await baseDeDatos
    .insert(clientes)
    .values({ ...alta, nroDocDigitos: nroDoc })
    .returning({ id: clientes.id });
  return buscarCliente(creado.id);
}

type CambiosQueCortanLaCuenta = { activo?: boolean; cuentaCorriente?: boolean };

function exigirSaldoSaldadoSiCortaLaCuenta(
  cliente: Cliente,
  { activo, cuentaCorriente }: CambiosQueCortanLaCuenta
) {
  const cortaLaCuenta = activo === false || cuentaCorriente === false;
  if (cortaLaCuenta && cliente.saldo !== SALDO_SALDADO) {
    throw crearError(ERRORES.SALDO_PENDIENTE, { saldo: cliente.saldo });
  }
}

// Alta y edición de clientes: documento único, cuenta corriente y límite de crédito opcional.
// Baja lógica de clientes, y sin cortar la cuenta corriente mientras haya saldo.
export async function editarCliente(
  _usuarioActual: UsuarioSesion,
  idSinValidar: unknown,
  cambiosSinValidar: unknown
): Promise<Cliente> {
  const clienteId = esquemaId.parse(idSinValidar);
  const { nroDoc, ...cambios } = esquemaEdicionCliente.parse(cambiosSinValidar);
  exigirSaldoSaldadoSiCortaLaCuenta(await buscarCliente(clienteId), cambios);
  if (nroDoc) await exigirDocumentoLibre(nroDoc, clienteId);
  const cambiosEnColumnas = nroDoc
    ? { ...cambios, nroDocDigitos: nroDoc }
    : cambios;
  if (hayCambios(cambiosEnColumnas)) {
    await baseDeDatos
      .update(clientes)
      .set(cambiosEnColumnas)
      .where(esIgualA(clientes.id, clienteId));
  }
  return buscarCliente(clienteId);
}
