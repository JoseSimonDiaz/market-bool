import { PestaniasDeNavegacion } from '@/componentes/comunes/pestanias-de-navegacion';
import { Pila } from '@/componentes/primitivas';
import { PESTANIAS_PRODUCTOS } from '@/constantes/navegacion';
import type { RUTAS } from '@/constantes/rutas';

export default function LayoutProductos({
  children,
}: LayoutProps<typeof RUTAS.productos>) {
  return (
    <Pila espacio={6}>
      <PestaniasDeNavegacion
        pestanias={PESTANIAS_PRODUCTOS}
        descripcion="Secciones de productos"
      />
      {children}
    </Pila>
  );
}
