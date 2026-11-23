'use client';

import {
  BarElement,
  CategoryScale,
  Chart as RegistroDeGraficos,
  LinearScale,
  Tooltip,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';
import { Bar as GraficoDeBarras } from 'react-chartjs-2';
import { IMPORTE_CERO } from '@/constantes/dominio';
import { COLOR_VENTAS_DIARIAS } from '@/constantes/estilos';
import { formatearDiaCorto, formatearMoneda } from '@/lib/formato';
import type { Tablero } from '@/servicios/tablero';

RegistroDeGraficos.register(BarElement, CategoryScale, LinearScale, Tooltip);

function importeDeLaBarra(barra: TooltipItem<'bar'>) {
  return formatearMoneda(barra.parsed.y ?? IMPORTE_CERO);
}

function importeDelEje(importe: number | string) {
  return formatearMoneda(Number(importe));
}

function opcionesDelGrafico(): ChartOptions<'bar'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: importeDeLaBarra } },
    },
    scales: { y: { ticks: { callback: importeDelEje } } },
  };
}

export function GraficoVentasDiarias({
  ventasDiarias,
}: {
  ventasDiarias: Tablero['ventasDiarias'];
}) {
  const barras = {
    labels: ventasDiarias.map(({ fecha }) => formatearDiaCorto(fecha)),
    datasets: [
      {
        label: 'Ventas',
        data: ventasDiarias.map(({ importe }) => importe),
        backgroundColor: COLOR_VENTAS_DIARIAS,
      },
    ],
  };
  return (
    <GraficoDeBarras
      data={barras}
      options={opcionesDelGrafico()}
      aria-label="Ventas diarias de los últimos 30 días"
      role="img"
    />
  );
}
