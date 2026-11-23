import { Badge } from '@/componentes/ui/badge';
import type { EstadoFactura } from '@/constantes/dominio';
import { ETIQUETA_ESTADO_FACTURA } from '@/constantes/etiquetas';
import { VARIANTE_SEGUN_ESTADO_FACTURA } from '@/constantes/interfaz';

export function InsigniaEstadoFactura({ estado }: { estado: EstadoFactura }) {
  return (
    <Badge variant={VARIANTE_SEGUN_ESTADO_FACTURA[estado]}>
      {ETIQUETA_ESTADO_FACTURA[estado]}
    </Badge>
  );
}
