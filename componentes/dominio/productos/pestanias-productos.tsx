'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PESTANIAS_PRODUCTOS, type Pestania } from '@/constantes/navegacion';
import { ARIA_PAGINA_ACTUAL } from '@/constantes/url';

function EnlacePestania({ pestania }: { pestania: Pestania }) {
  const rutaActual = usePathname();
  const marcaDePaginaActual =
    rutaActual === pestania.ruta ? ARIA_PAGINA_ACTUAL : undefined;

  return (
    <Link
      href={pestania.ruta}
      aria-current={marcaDePaginaActual}
      className="inline-block border-b-2 border-transparent px-1 pb-2 text-sm whitespace-nowrap text-muted-foreground hover:text-foreground aria-[current=page]:border-primary aria-[current=page]:font-medium aria-[current=page]:text-foreground"
    >
      {pestania.etiqueta}
    </Link>
  );
}

export function PestaniasProductos() {
  return (
    <nav aria-label="Secciones de productos" className="border-b">
      <ul className="-mb-px flex gap-4 overflow-x-auto">
        {PESTANIAS_PRODUCTOS.map((pestania) => (
          <li key={pestania.ruta}>
            <EnlacePestania pestania={pestania} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
