'use client';

import { UserXIcon } from 'lucide-react';
import { BotonConIcono } from '@/componentes/comunes/boton-icono';
import { DatosDelComprador } from '@/componentes/dominio/ventas/datos-del-comprador';
import { Fila } from '@/componentes/primitivas';
import { TEXTO_CONSUMIDOR_FINAL } from '@/constantes/etiquetas';
import type { Cliente } from '@/servicios/clientes';

export function CompradorElegido({
  comprador,
  alQuitar,
}: {
  comprador: Cliente;
  alQuitar: () => void;
}) {
  return (
    <Fila espacio={3} className="justify-between">
      <DatosDelComprador cliente={comprador} />
      <BotonConIcono
        icono={UserXIcon}
        etiqueta={TEXTO_CONSUMIDOR_FINAL}
        onClick={alQuitar}
      />
    </Fila>
  );
}
