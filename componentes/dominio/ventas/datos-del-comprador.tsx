import { Pila, Texto } from '@/componentes/primitivas';
import { TEXTO_SIN_LIMITE } from '@/constantes/interfaz';
import { formatearMoneda } from '@/lib/formato';
import { tieneValor } from '@/lib/valores';
import type { Cliente } from '@/servicios/clientes';

function textoDeCuentaCorriente(cliente: Cliente) {
  if (!cliente.cuentaCorriente) return 'Sin cuenta corriente';
  const disponible = tieneValor(cliente.disponible)
    ? formatearMoneda(cliente.disponible)
    : TEXTO_SIN_LIMITE;
  return `Saldo ${formatearMoneda(cliente.saldo)} · Disponible ${disponible}`;
}

export function DatosDelComprador({ cliente }: { cliente: Cliente }) {
  return (
    <Pila espacio={1}>
      <Texto className="font-medium">{cliente.nombre}</Texto>
      <Texto tono="suave" tamanio="chico">
        {cliente.tipoDoc} {cliente.nroDoc}
      </Texto>
      <Texto tono="suave" tamanio="chico">
        {textoDeCuentaCorriente(cliente)}
      </Texto>
    </Pila>
  );
}
