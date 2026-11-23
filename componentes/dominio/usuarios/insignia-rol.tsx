import { Badge } from '@/componentes/ui/badge';
import type { Rol } from '@/constantes/dominio';
import { ETIQUETA_ROL } from '@/constantes/etiquetas';
import { VARIANTE_SEGUN_ROL } from '@/constantes/interfaz';

export function InsigniaRol({ rol }: { rol: Rol }) {
  return <Badge variant={VARIANTE_SEGUN_ROL[rol]}>{ETIQUETA_ROL[rol]}</Badge>;
}
