import { PlusIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/componentes/ui/button';

export function BotonNuevo({
  texto,
  ...propsDelBoton
}: ComponentProps<typeof Button> & { texto: string }) {
  return (
    <Button {...propsDelBoton}>
      <PlusIcon />
      {texto}
    </Button>
  );
}
