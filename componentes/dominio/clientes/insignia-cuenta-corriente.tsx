import { Badge } from '@/componentes/ui/badge';

export function InsigniaCuentaCorriente({
  habilitada,
}: {
  habilitada: boolean;
}) {
  return habilitada ? (
    <Badge variant="secondary">Habilitada</Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      No habilitada
    </Badge>
  );
}
