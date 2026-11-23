import { DatoFicha } from '@/componentes/comunes/dato-ficha';
import { InsigniaActivo } from '@/componentes/comunes/insignia-activo';
import { InsigniaBajoMinimo } from '@/componentes/dominio/productos/insignia-bajo-minimo';
import { Fila, Grilla } from '@/componentes/primitivas';
import { Card, CardContent } from '@/componentes/ui/card';
import { formatearEntero, formatearMoneda } from '@/lib/formato';
import type { Producto } from '@/servicios/productos';

export function FichaProducto({ producto }: { producto: Producto }) {
  return (
    <Card>
      <CardContent>
        <Grilla columnas={4}>
          <DatoFicha etiqueta="Precio">
            {formatearMoneda(producto.precio)}
          </DatoFicha>
          <DatoFicha etiqueta="Existencia">
            <Fila>
              {formatearEntero(producto.existencia)}
              {producto.bajoMinimo && <InsigniaBajoMinimo />}
            </Fila>
          </DatoFicha>
          <DatoFicha etiqueta="Stock mínimo">
            {formatearEntero(producto.stockMinimo)}
          </DatoFicha>
          <DatoFicha etiqueta="Estado">
            <InsigniaActivo activo={producto.activo} />
          </DatoFicha>
        </Grilla>
      </CardContent>
    </Card>
  );
}
