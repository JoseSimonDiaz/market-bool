'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MODULOS_DE_ADMIN,
  MODULOS_DE_TODOS,
  type Modulo,
} from '@/constantes/navegacion';
import { RUTAS } from '@/constantes/rutas';
import { ARIA_PAGINA_ACTUAL } from '@/constantes/url';

function esRutaDelModulo(rutaActual: string, rutaModulo: string) {
  if (rutaModulo === RUTAS.inicio) return rutaActual === RUTAS.inicio;
  return rutaActual === rutaModulo || rutaActual.startsWith(`${rutaModulo}/`);
}

function EnlaceModulo({
  modulo,
  alNavegar,
}: {
  modulo: Modulo;
  alNavegar?: () => void;
}) {
  const rutaActual = usePathname();
  const moduloActivo = esRutaDelModulo(rutaActual, modulo.ruta);
  const marcaDePaginaActual = moduloActivo ? ARIA_PAGINA_ACTUAL : undefined;

  return (
    <Link
      href={modulo.ruta}
      onClick={alNavegar}
      aria-current={marcaDePaginaActual}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground aria-[current=page]:bg-sidebar-primary aria-[current=page]:text-sidebar-primary-foreground"
    >
      <modulo.icono className="size-4" aria-hidden />
      {modulo.etiqueta}
    </Link>
  );
}

export function Navegacion({
  esAdmin,
  alNavegar,
}: {
  esAdmin: boolean;
  alNavegar?: () => void;
}) {
  const modulosVisibles = esAdmin ? MODULOS_DE_ADMIN : MODULOS_DE_TODOS;

  return (
    <nav aria-label="Módulos">
      <ul className="flex flex-col gap-1">
        {modulosVisibles.map((modulo) => (
          <li key={modulo.ruta}>
            <EnlaceModulo modulo={modulo} alNavegar={alNavegar} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
