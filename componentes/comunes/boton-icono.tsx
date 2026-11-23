import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/componentes/ui/button';

type PropsBotonIcono = ComponentProps<typeof Button> & {
  icono: LucideIcon;
  etiqueta: string;
};

export function BotonIcono({
  icono: Icono,
  etiqueta,
  ...propsDelBoton
}: PropsBotonIcono) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={etiqueta}
      {...propsDelBoton}
    >
      <Icono />
    </Button>
  );
}

export function BotonConIcono({
  icono: Icono,
  etiqueta,
  ...propsDelBoton
}: PropsBotonIcono) {
  return (
    <Button variant="outline" {...propsDelBoton}>
      <Icono />
      {etiqueta}
    </Button>
  );
}
