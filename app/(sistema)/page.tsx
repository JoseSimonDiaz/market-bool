import type { Metadata } from 'next';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { GraficosDelTablero } from '@/componentes/dominio/tablero/graficos-del-tablero';
import { IndicadoresDelTablero } from '@/componentes/dominio/tablero/indicadores-del-tablero';
import { TablaMasVendidos } from '@/componentes/dominio/tablero/tabla-mas-vendidos';
import { Pila, Titulo } from '@/componentes/primitivas';
import { obtenerTablero } from '@/servicios/tablero';

export const metadata: Metadata = { title: 'Inicio' };

export default async function PaginaInicio() {
  const usuario = await usuarioDePaginaOLogin();
  const tablero = await obtenerTablero(usuario);

  return (
    <Pila espacio={6}>
      <EncabezadoPagina
        titulo={`Hola, ${usuario.nombre}`}
        descripcion="Así vienen las ventas de market-bool."
      />
      <IndicadoresDelTablero tablero={tablero} />
      <GraficosDelTablero tablero={tablero} />
      <Pila espacio={3}>
        <Titulo nivel={2}>Más vendidos del mes</Titulo>
        <TablaMasVendidos productos={tablero.masVendidos} />
      </Pila>
    </Pila>
  );
}
