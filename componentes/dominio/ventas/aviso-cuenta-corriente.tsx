import { Texto } from '@/componentes/primitivas';
import type { Cliente } from '@/servicios/clientes';

export function AvisoCuentaCorriente({
  comprador,
}: {
  comprador: Cliente | null;
}) {
  if (comprador?.cuentaCorriente) return null;
  return (
    <Texto tono="peligro">
      Elegí un cliente con cuenta corriente habilitada.
    </Texto>
  );
}
