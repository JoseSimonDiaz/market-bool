import { GraficoFormasDePago } from '@/componentes/dominio/tablero/grafico-formas-de-pago';
import { GraficoVentasDiarias } from '@/componentes/dominio/tablero/grafico-ventas-diarias';
import { TarjetaGrafico } from '@/componentes/dominio/tablero/tarjeta-grafico';
import type { Tablero } from '@/servicios/tablero';

export function GraficosDelTablero({ tablero }: { tablero: Tablero }) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <TarjetaGrafico
        titulo="Ventas diarias"
        descripcion="Últimos 30 días"
        className="lg:col-span-2"
      >
        <GraficoVentasDiarias ventasDiarias={tablero.ventasDiarias} />
      </TarjetaGrafico>
      <TarjetaGrafico titulo="Formas de pago" descripcion="Ventas del mes">
        <GraficoFormasDePago porFormaDePago={tablero.porFormaDePago} />
      </TarjetaGrafico>
    </section>
  );
}
