import { Badge } from '@/componentes/ui/badge';

export function InsigniaActivo({ activo }: { activo: boolean }) {
  return activo ? (
    <Badge variant="secondary">Activo</Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      Inactivo
    </Badge>
  );
}
