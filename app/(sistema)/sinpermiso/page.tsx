import type { Metadata } from 'next';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { Pila } from '@/componentes/primitivas';
import { BotonEnlace } from '@/componentes/comunes/boton-enlace';
import { RUTAS } from '@/constantes/rutas';

export const metadata: Metadata = { title: 'Sin permiso' };

export default function PaginaSinPermiso() {
  return (
    <Pila espacio={6}>
      <EncabezadoPagina
        titulo="Sin permiso"
        descripcion="Tu rol no tiene acceso a esta sección. Si lo necesitás, pedíselo al administrador."
      />
      <BotonEnlace destino={RUTAS.inicio} className="w-fit">
        Volver al inicio
      </BotonEnlace>
    </Pila>
  );
}
