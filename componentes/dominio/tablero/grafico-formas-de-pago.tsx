'use client';

import {
  ArcElement,
  Chart as RegistroDeGraficos,
  Legend,
  Tooltip,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';
import { Doughnut as GraficoDeAnillo } from 'react-chartjs-2';
import { ETIQUETA_FORMA_PAGO } from '@/constantes/etiquetas';
import { COLOR_FORMA_PAGO } from '@/constantes/estilos';
import { formatearMoneda } from '@/lib/formato';
import type { Tablero } from '@/servicios/tablero';

RegistroDeGraficos.register(ArcElement, Legend, Tooltip);

function importeDeLaPorcion(porcion: TooltipItem<'doughnut'>) {
  return `${porcion.label}: ${formatearMoneda(porcion.parsed)}`;
}

function opcionesDelGrafico(): ChartOptions<'doughnut'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { callbacks: { label: importeDeLaPorcion } },
    },
  };
}

export function GraficoFormasDePago({
  porFormaDePago,
}: {
  porFormaDePago: Tablero['porFormaDePago'];
}) {
  const porciones = {
    labels: porFormaDePago.map(({ forma }) => ETIQUETA_FORMA_PAGO[forma]),
    datasets: [
      {
        data: porFormaDePago.map(({ importe }) => importe),
        backgroundColor: porFormaDePago.map(
          ({ forma }) => COLOR_FORMA_PAGO[forma]
        ),
      },
    ],
  };
  return (
    <GraficoDeAnillo
      data={porciones}
      options={opcionesDelGrafico()}
      aria-label="Ventas del mes por forma de pago"
      role="img"
    />
  );
}
