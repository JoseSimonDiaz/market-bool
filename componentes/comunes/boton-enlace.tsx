import Link from 'next/link';
import type { ComponentProps } from 'react';
import { Button } from '@/componentes/ui/button';

export function BotonEnlace({
  destino,
  ...propsDelBoton
}: ComponentProps<typeof Button> & { destino: string }) {
  return (
    <Button
      nativeButton={false}
      render={<Link href={destino} />}
      {...propsDelBoton}
    />
  );
}
