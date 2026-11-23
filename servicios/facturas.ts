import {
  and as cumplenTodas,
  asc as ascendente,
  desc as descendente,
  eq as esIgualA,
  or as cumpleAlguna,
  sql as expresionSql,
  type SQL,
} from 'drizzle-orm';
import { alias as aliasDeTabla } from 'drizzle-orm/sqlite-core';
import { baseDeDatos } from '@/basedatos/conexion';
import {
  condicionDeBusqueda,
  condicionDesdeElDia,
  condicionHastaElDia,
  consultarPagina,
  type Paginado,
} from '@/basedatos/consultas';
import {
  clientes,
  facturaItems,
  facturas,
  numeradores,
  usuarios,
} from '@/basedatos/esquema';
import { consultarSaldoAlMomentoDeLaFactura } from '@/basedatos/saldos';
import { ALIAS_SQL } from '@/constantes/basedatos';
import {
  ESTADO_FACTURA,
  FORMA_PAGO,
  IMPORTE_CERO,
  INCREMENTO_NUMERADOR,
  NUMERADOR,
  PRIMER_NUMERO,
  PUNTO_VENTA,
  type EstadoFactura,
  type FormaPago,
  type TipoTarjeta,
} from '@/constantes/dominio';
import { ERRORES } from '@/constantes/errores';
import { DIGITOS_NUMERO_COMPROBANTE } from '@/constantes/formato';
import { esquemaId } from '@/esquemas/comunes';
import {
  esquemaFiltroFacturas,
  type FiltroFacturas,
} from '@/esquemas/facturas';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import {
  formatearDocumento,
  formatearNumeroComprobante,
  soloDigitos,
} from '@/lib/formato';
import { calcularVuelto } from '@/lib/ventas';
import { crearError } from '@/servicios/errores';

const anuladores = aliasDeTabla(usuarios, ALIAS_SQL.anuladores);

const seleccionarFacturaCompleta = () =>
  baseDeDatos
    .select({
      id: facturas.id,
      puntoVenta: facturas.puntoVenta,
      numero: facturas.numero,
      fecha: facturas.fecha,
      estado: facturas.estado,
      total: facturas.total,
      formaPago: facturas.formaPago,
      montoRecibido: facturas.montoRecibido,
      tarjetaTipo: facturas.tarjetaTipo,
      tarjetaMarca: facturas.tarjetaMarca,
      tarjetaUltimos4: facturas.tarjetaUltimos4,
      motivoAnulacion: facturas.motivoAnulacion,
      anuladaEn: facturas.anuladaEn,
      cliente: {
        id: clientes.id,
        nombre: clientes.nombre,
        tipoDoc: clientes.tipoDoc,
        nroDocDigitos: clientes.nroDocDigitos,
        domicilio: clientes.domicilio,
      },
      vendedor: { id: usuarios.id, nombre: usuarios.nombre },
      anuladaPor: { id: anuladores.id, nombre: anuladores.nombre },
    })
    .from(facturas)
    .leftJoin(clientes, esIgualA(clientes.id, facturas.clienteId))
    .innerJoin(usuarios, esIgualA(usuarios.id, facturas.usuarioId))
    .leftJoin(anuladores, esIgualA(anuladores.id, facturas.anuladaPorId));

type FilaFactura = Awaited<
  ReturnType<typeof seleccionarFacturaCompleta>
>[number];

export type PagoDeFactura =
  | { forma: typeof FORMA_PAGO.contado; montoRecibido: number; vuelto: number }
  | {
      forma: typeof FORMA_PAGO.tarjeta;
      tarjeta: {
        tipo: TipoTarjeta | null;
        marca: string | null;
        ultimos4: string | null;
      };
    }
  | { forma: typeof FORMA_PAGO.cuentaCorriente };

function pagoDeLaFactura(fila: FilaFactura): PagoDeFactura {
  if (fila.formaPago === FORMA_PAGO.contado) {
    const montoRecibido = fila.montoRecibido ?? fila.total;
    const vuelto = calcularVuelto(montoRecibido, fila.total);
    return { forma: fila.formaPago, montoRecibido, vuelto };
  }
  if (fila.formaPago === FORMA_PAGO.tarjeta) {
    const tarjeta = {
      tipo: fila.tarjetaTipo,
      marca: fila.tarjetaMarca,
      ultimos4: fila.tarjetaUltimos4,
    };
    return { forma: fila.formaPago, tarjeta };
  }
  return { forma: FORMA_PAGO.cuentaCorriente };
}

function compradorDeLaFactura({ cliente }: FilaFactura) {
  if (!cliente) return null;
  const { nroDocDigitos, ...datosDelCliente } = cliente;
  return {
    ...datosDelCliente,
    nroDoc: formatearDocumento(cliente.tipoDoc, nroDocDigitos),
  };
}

function anulacionDeLaFactura(fila: FilaFactura) {
  if (fila.estado !== ESTADO_FACTURA.anulada) return undefined;
  return {
    fecha: fila.anuladaEn,
    usuario: fila.anuladaPor,
    motivo: fila.motivoAnulacion,
  };
}

function renglonesDeLaFactura(facturaId: number) {
  return baseDeDatos
    .select({
      productoId: facturaItems.productoId,
      codigo: facturaItems.codigo,
      descripcion: facturaItems.descripcion,
      cantidad: facturaItems.cantidad,
      precioUnitario: facturaItems.precioUnitario,
      subtotal: facturaItems.subtotal,
    })
    .from(facturaItems)
    .where(esIgualA(facturaItems.facturaId, facturaId))
    .orderBy(ascendente(facturaItems.id));
}

function saldoQueDejoLaFactura(fila: FilaFactura) {
  if (fila.formaPago !== FORMA_PAGO.cuentaCorriente || !fila.cliente) {
    return undefined;
  }
  return consultarSaldoAlMomentoDeLaFactura(fila.cliente.id, fila.id);
}

async function armarFactura(fila: FilaFactura) {
  const [items, saldoCliente] = await Promise.all([
    renglonesDeLaFactura(fila.id),
    saldoQueDejoLaFactura(fila),
  ]);
  return {
    id: fila.id,
    puntoVenta: fila.puntoVenta,
    numero: fila.numero,
    numeroFormateado: formatearNumeroComprobante(fila.puntoVenta, fila.numero),
    fecha: fila.fecha,
    estado: fila.estado,
    cliente: compradorDeLaFactura(fila),
    vendedor: fila.vendedor,
    items,
    total: fila.total,
    pago: pagoDeLaFactura(fila),
    saldoCliente,
    anulacion: anulacionDeLaFactura(fila),
  };
}

export type Factura = Awaited<ReturnType<typeof armarFactura>>;

// Comprobante: datos del comercio, número, fecha y hora, vendedor, comprador, detalle, total y forma de pago.
export async function obtenerFactura(
  _usuarioActual: UsuarioSesion,
  idSinValidar: unknown
): Promise<Factura> {
  const facturaId = esquemaId.parse(idSinValidar);
  const [fila] = await seleccionarFacturaCompleta().where(
    esIgualA(facturas.id, facturaId)
  );
  if (!fila) throw crearError(ERRORES.NO_ENCONTRADO);
  return armarFactura(fila);
}

const seleccionarResumenDeFacturas = () =>
  baseDeDatos
    .select({
      id: facturas.id,
      puntoVenta: facturas.puntoVenta,
      numero: facturas.numero,
      fecha: facturas.fecha,
      cliente: { id: clientes.id, nombre: clientes.nombre },
      vendedor: { id: usuarios.id, nombre: usuarios.nombre },
      total: facturas.total,
      formaPago: facturas.formaPago,
      estado: facturas.estado,
    })
    .from(facturas)
    .leftJoin(clientes, esIgualA(clientes.id, facturas.clienteId))
    .innerJoin(usuarios, esIgualA(usuarios.id, facturas.usuarioId));

type FilaResumenFactura = Awaited<
  ReturnType<typeof seleccionarResumenDeFacturas>
>[number];

export type FacturaDelListado = Omit<
  FilaResumenFactura,
  'puntoVenta' | 'numero'
> & {
  numeroFormateado: string;
};

export type ListadoFacturas = Paginado<FacturaDelListado> & {
  totalEmitido: number;
};

function aFacturaDelListado({
  puntoVenta,
  numero,
  ...factura
}: FilaResumenFactura): FacturaDelListado {
  return {
    ...factura,
    numeroFormateado: formatearNumeroComprobante(puntoVenta, numero),
  };
}

function condicionDeNumero(textoBuscado: string) {
  const digitos = soloDigitos(textoBuscado);
  if (!digitos) return undefined;
  const numeroBuscado = Number(digitos.slice(-DIGITOS_NUMERO_COMPROBANTE));
  return esIgualA(facturas.numero, numeroBuscado);
}

function condicionDeBusquedaDeFactura(textoBuscado?: string) {
  if (!textoBuscado) return undefined;
  return cumpleAlguna(
    condicionDeNumero(textoBuscado),
    condicionDeBusqueda([clientes.nombre], textoBuscado)
  );
}

function igualSiHayValor<Valor extends string | number>(
  columna: Parameters<typeof esIgualA>[0],
  valorBuscado?: Valor
) {
  if (!valorBuscado) return undefined;
  return esIgualA(columna, valorBuscado);
}

function condicionesDeFacturas(filtros: FiltroFacturas) {
  return cumplenTodas(
    condicionDeBusquedaDeFactura(filtros.q),
    condicionDesdeElDia(facturas.fecha, filtros.desde),
    condicionHastaElDia(facturas.fecha, filtros.hasta),
    igualSiHayValor(facturas.clienteId, filtros.clienteId),
    igualSiHayValor(facturas.usuarioId, filtros.vendedorId),
    igualSiHayValor<FormaPago>(facturas.formaPago, filtros.forma),
    igualSiHayValor<EstadoFactura>(facturas.estado, filtros.estado)
  );
}

async function resumirFacturas(condiciones: SQL | undefined) {
  const esEmitida = esIgualA(facturas.estado, ESTADO_FACTURA.emitida);
  const [resumen] = await baseDeDatos
    .select({
      cantidad: expresionSql<number>`count(*)`.mapWith(Number),
      totalEmitido:
        expresionSql<number>`coalesce(sum(case when ${esEmitida} then ${facturas.total} end), ${IMPORTE_CERO})`.mapWith(
          Number
        ),
    })
    .from(facturas)
    .leftJoin(clientes, esIgualA(clientes.id, facturas.clienteId))
    .where(condiciones);
  return resumen;
}

function buscarFilasDeFacturas(condiciones: SQL | undefined) {
  return async (limite: number, desplazamiento: number) => {
    const filas = await seleccionarResumenDeFacturas()
      .where(condiciones)
      .orderBy(descendente(facturas.fecha), descendente(facturas.id))
      .limit(limite)
      .offset(desplazamiento);
    return filas.map(aFacturaDelListado);
  };
}

// Listado de facturas: filtros por fechas, cliente, forma de pago y vendedor; búsqueda por número.
export async function listarFacturas(
  _usuarioActual: UsuarioSesion,
  filtrosSinValidar: unknown
): Promise<ListadoFacturas> {
  const filtros = esquemaFiltroFacturas.parse(filtrosSinValidar);
  const condiciones = condicionesDeFacturas(filtros);
  const resumen = resumirFacturas(condiciones);
  const pagina = await consultarPagina({
    page: filtros.page,
    pageSize: filtros.pageSize,
    total: resumen.then(({ cantidad }) => cantidad),
    buscarFilas: buscarFilasDeFacturas(condiciones),
  });
  return { ...pagina, totalEmitido: (await resumen).totalEmitido };
}

// Próximo número de factura: es informativo, el número real se asigna al confirmar.
export async function consultarProximoNumero(_usuarioActual: UsuarioSesion) {
  const [numerador] = await baseDeDatos
    .select({ ultimo: numeradores.ultimo })
    .from(numeradores)
    .where(esIgualA(numeradores.clave, NUMERADOR.factura));
  const proximo = numerador
    ? numerador.ultimo + INCREMENTO_NUMERADOR
    : PRIMER_NUMERO;
  return { numeroFormateado: formatearNumeroComprobante(PUNTO_VENTA, proximo) };
}
