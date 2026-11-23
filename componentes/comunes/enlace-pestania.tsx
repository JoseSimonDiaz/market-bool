'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Pestania } from '@/constantes/navegacion';
import { ARIA_PAGINA_ACTUAL } from '@/constantes/url';

export function EnlacePestania({ pestania }: { pestania: Pestania }) {
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
