'use client';

import { useCallback } from 'react';
import { CompradorElegido } from '@/componentes/dominio/ventas/comprador-elegido';
import { ElegirComprador } from '@/componentes/dominio/ventas/elegir-comprador';
import { Pila, Titulo } from '@/componentes/primitivas';
import { Card, CardContent } from '@/componentes/ui/card';
import type { Cliente } from '@/servicios/clientes';

export function SeccionComprador({
  comprador,
  alCambiar,
}: {
  comprador: Cliente | null;
  alCambiar: (cliente: Cliente | null) => void;
}) {
  const volverAConsumidorFinal = useCallback(
    () => alCambiar(null),
    [alCambiar]
  );
  const contenido = comprador ? (
    <CompradorElegido comprador={comprador} alQuitar={volverAConsumidorFinal} />
  ) : (
    <ElegirComprador alElegir={alCambiar} />
  );

  return (
    <Card>
      <CardContent>
        <Pila espacio={3}>
          <Titulo nivel={2}>Comprador</Titulo>
          {contenido}
        </Pila>
      </CardContent>
    </Card>
  );
}
