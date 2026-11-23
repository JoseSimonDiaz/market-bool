import Link from 'next/link';
import { RUTAS } from '@/constantes/rutas';

export function Marca() {
  return (
    <Link
      href={RUTAS.inicio}
      className="flex items-center gap-2 px-3 py-2 font-semibold tracking-tight"
    >
      <span
        aria-hidden
        className="relative size-6 overflow-hidden rounded-full border-2 border-current bg-white"
      >
        <span className="absolute inset-x-0 top-0 h-1/2 bg-primary" />
        <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current" />
        <span className="absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full border-2 border-current bg-white" />
      </span>
      market-bool
    </Link>
  );
}
