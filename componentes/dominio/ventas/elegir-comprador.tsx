'use client';

import { BuscadorEnVivo } from '@/componentes/comunes/buscador-en-vivo';
import type { DescripcionDeResultado } from '@/componentes/comunes/resultado-de-busqueda';
import { BotonAltaRapidaCliente } from '@/componentes/dominio/ventas/boton-alta-rapida-cliente';
import { Pila, Texto } from '@/componentes/primitivas';
import { TEXTO_CONSUMIDOR_FINAL } from '@/constantes/etiquetas';
import { RUTAS_API } from '@/constantes/rutas';
import { formatearMoneda } from '@/lib/formato';
import type { Cliente } from '@/servicios/clientes';

function describirCliente(cliente: Cliente): DescripcionDeResultado {
  return {
    clave: cliente.id,
    titulo: cliente.nombre,
    detalle: `${cliente.tipoDoc} ${cliente.nroDoc} · Saldo ${formatearMoneda(cliente.saldo)}`,
    elegible: cliente.activo,
  };
}

export function ElegirComprador({
  alElegir,
}: {
  alElegir: (cliente: Cliente) => void;
}) {
  return (
    <Pila espacio={3}>
      <Texto tono="suave">{TEXTO_CONSUMIDOR_FINAL}</Texto>
      <BuscadorEnVivo<Cliente>
        rutaApi={RUTAS_API.clientes}
        etiqueta="Buscar cliente por nombre o documento"
        describir={describirCliente}
        alElegir={alElegir}
      />
      <BotonAltaRapidaCliente alCrear={alElegir} />
    </Pila>
  );
}
