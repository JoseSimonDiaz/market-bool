import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/componentes/ui/card';

export function TarjetaIndicador({
  etiqueta,
  valor,
  detalle,
  accion,
}: {
  etiqueta: string;
  valor: string;
  detalle: string;
  accion?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{etiqueta}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{valor}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {detalle}
      </CardContent>
      {accion && <CardFooter>{accion}</CardFooter>}
    </Card>
  );
}
