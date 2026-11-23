'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button } from '@/componentes/ui/button';
import { UN_RESULTADO } from '@/constantes/interfaz';
import { PRIMERA_PAGINA, UNA_PAGINA } from '@/constantes/url';
import { useEnlaceAPagina } from '@/hooks/usar-parametros-url';
import { formatearEntero } from '@/lib/formato';

type PropsDelPaginador = { page: number; pageSize: number; total: number };

function BotonDePagina({
  destino,
  habilitado,
  children,
}: {
  destino: number;
  habilitado: boolean;
  children: ReactNode;
}) {
  const enlaceAPagina = useEnlaceAPagina();
  const enlace = habilitado ? (
    <Link href={enlaceAPagina(destino)} />
  ) : undefined;
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={!habilitado}
      nativeButton={false}
      render={enlace}
    >
      {children}
    </Button>
  );
}

function contarPaginas({ pageSize, total }: PropsDelPaginador) {
  return Math.max(PRIMERA_PAGINA, Math.ceil(total / pageSize));
}

export function Paginador(propsDelPaginador: PropsDelPaginador) {
  const { page, total } = propsDelPaginador;
  const cantidadDePaginas = contarPaginas(propsDelPaginador);
  const textoResultados = total === UN_RESULTADO ? 'resultado' : 'resultados';

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground"
    >
      <p>
        {formatearEntero(total)} {textoResultados} · página {page} de{' '}
        {cantidadDePaginas}
      </p>
      <div className="flex gap-2">
        <BotonDePagina
          destino={page - UNA_PAGINA}
          habilitado={page > PRIMERA_PAGINA}
        >
          <ChevronLeftIcon />
          Anterior
        </BotonDePagina>
        <BotonDePagina
          destino={page + UNA_PAGINA}
          habilitado={page < cantidadDePaginas}
        >
          Siguiente
          <ChevronRightIcon />
        </BotonDePagina>
      </div>
    </nav>
  );
}
