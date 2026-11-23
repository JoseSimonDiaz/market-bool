import type { VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { buttonVariants as variantesDeBoton } from '@/componentes/ui/button';
import { combinarClases } from '@/lib/utils';

type PropsBotonEnlace = Omit<ComponentProps<typeof Link>, 'href'> &
  VariantProps<typeof variantesDeBoton> & { destino: string };

export function BotonEnlace({
  destino,
  variant: variante,
  size: tamanio,
  className,
  ...propsDelEnlace
}: PropsBotonEnlace) {
  return (
    <Link
      href={destino}
      className={combinarClases(
        variantesDeBoton({ variant: variante, size: tamanio }),
        className
      )}
      {...propsDelEnlace}
    />
  );
}
