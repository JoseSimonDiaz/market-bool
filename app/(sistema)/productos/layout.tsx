import { PestaniasProductos } from '@/componentes/dominio/productos/pestanias-productos';
import { Pila } from '@/componentes/primitivas';
import type { RUTAS } from '@/constantes/rutas';

export default function LayoutProductos({
  children,
}: LayoutProps<typeof RUTAS.productos>) {
  return (
    <Pila espacio={6}>
      <PestaniasProductos />
      {children}
    </Pila>
  );
}
