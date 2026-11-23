import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/componentes/ui/card';
import { ALTO_GRAFICO } from '@/constantes/estilos';
import { combinarClases } from '@/lib/utils';

export function TarjetaGrafico({
  titulo,
  descripcion,
  className,
  children,
}: {
  titulo: string;
  descripcion: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        <CardDescription>{descripcion}</CardDescription>
      </CardHeader>
      <CardContent>
        <figure className={combinarClases('relative', ALTO_GRAFICO)}>
          {children}
        </figure>
      </CardContent>
    </Card>
  );
}
