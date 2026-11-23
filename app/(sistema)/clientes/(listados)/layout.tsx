import { PestaniasDeNavegacion } from '@/componentes/comunes/pestanias-de-navegacion';
import { Pila } from '@/componentes/primitivas';
import { PESTANIAS_CLIENTES } from '@/constantes/navegacion';
import type { RUTAS } from '@/constantes/rutas';

export default function LayoutListadosClientes({
  children,
}: LayoutProps<typeof RUTAS.clientes>) {
  return (
    <Pila espacio={6}>
      <PestaniasDeNavegacion
        pestanias={PESTANIAS_CLIENTES}
        descripcion="Secciones de clientes"
      />
      {children}
    </Pila>
  );
}
