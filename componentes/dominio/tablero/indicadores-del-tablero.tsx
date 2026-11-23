import { BotonEnlace } from '@/componentes/comunes/boton-enlace';
import { TarjetaIndicador } from '@/componentes/dominio/tablero/tarjeta-indicador';
import { Grilla } from '@/componentes/primitivas';
import { RUTAS } from '@/constantes/rutas';
import { formatearEntero, formatearMoneda } from '@/lib/formato';
import type { Tablero } from '@/servicios/tablero';

function textoDeFacturas(cantidad: number) {
  return `Facturas emitidas: ${formatearEntero(cantidad)}`;
}

export function IndicadoresDelTablero({ tablero }: { tablero: Tablero }) {
  const { hoy, mes, cuentasCorrientes, bajoMinimo } = tablero;
  const detalleDelMes = `${textoDeFacturas(mes.cantidad)} · Ticket promedio ${formatearMoneda(mes.ticketPromedio)}`;
  const detalleDeLaDeuda = `Clientes con saldo: ${formatearEntero(cuentasCorrientes.clientesConSaldo)}`;
  const verDeudores = (
    <BotonEnlace destino={RUTAS.saldos} variant="link" size="sm">
      Ver deudores
    </BotonEnlace>
  );
  const verProductos = (
    <BotonEnlace destino={RUTAS.productosBajoMinimo} variant="link" size="sm">
      Ver productos para reponer
    </BotonEnlace>
  );

  return (
    <Grilla columnas={4}>
      <TarjetaIndicador
        etiqueta="Ventas de hoy"
        valor={formatearMoneda(hoy.importe)}
        detalle={textoDeFacturas(hoy.cantidad)}
      />
      <TarjetaIndicador
        etiqueta="Ventas del mes"
        valor={formatearMoneda(mes.importe)}
        detalle={detalleDelMes}
      />
      <TarjetaIndicador
        etiqueta="Adeudado en cuentas corrientes"
        valor={formatearMoneda(cuentasCorrientes.totalAdeudado)}
        detalle={detalleDeLaDeuda}
        accion={verDeudores}
      />
      <TarjetaIndicador
        etiqueta="Productos bajo el mínimo"
        valor={formatearEntero(bajoMinimo.cantidad)}
        detalle="Activos con existencia menor al stock mínimo"
        accion={verProductos}
      />
    </Grilla>
  );
}
