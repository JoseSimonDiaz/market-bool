'use client';

import { ErrorDelCampo } from '@/componentes/comunes/campos/marco-campo';
import { BuscadorEnVivo } from '@/componentes/comunes/buscador-en-vivo';
import type { DescripcionDeResultado } from '@/componentes/comunes/resultado-de-busqueda';
import { TablaRenglonesVenta } from '@/componentes/dominio/ventas/tabla-renglones-venta';
import { Pila, Titulo } from '@/componentes/primitivas';
import { Card, CardContent } from '@/componentes/ui/card';
import { EXISTENCIA_MINIMA } from '@/constantes/dominio';
import { RUTAS_API } from '@/constantes/rutas';
import type { FormularioDeVenta } from '@/hooks/usar-formulario-de-venta';
import { formatearEntero, formatearMoneda } from '@/lib/formato';
import type { Producto } from '@/servicios/productos';

function describirProducto(producto: Producto): DescripcionDeResultado {
  return {
    clave: producto.id,
    titulo: `${producto.codigo} · ${producto.descripcion}`,
    detalle: `${formatearMoneda(producto.precio)} · Disponible ${formatearEntero(producto.existencia)}`,
    elegible: producto.existencia > EXISTENCIA_MINIMA,
  };
}

export function SeccionRenglones({
  formulario,
  productos,
  alElegirProducto,
}: {
  formulario: FormularioDeVenta;
  productos: ReadonlyMap<number, Producto>;
  alElegirProducto: (producto: Producto) => void;
}) {
  return (
    <Card>
      <CardContent>
        <Pila espacio={3}>
          <Titulo nivel={2}>Productos</Titulo>
          <BuscadorEnVivo<Producto>
            rutaApi={RUTAS_API.productos}
            etiqueta="Buscar producto por código o descripción"
            describir={describirProducto}
            alElegir={alElegirProducto}
          />
          <formulario.AppField name="items">
            {(campo) => (
              <Pila espacio={2}>
                <TablaRenglonesVenta
                  renglones={campo.state.value}
                  productos={productos}
                  alCambiar={campo.handleChange}
                />
                <ErrorDelCampo />
              </Pila>
            )}
          </formulario.AppField>
        </Pila>
      </CardContent>
    </Card>
  );
}
