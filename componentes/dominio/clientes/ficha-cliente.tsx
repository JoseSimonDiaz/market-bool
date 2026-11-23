import { DatoFicha } from '@/componentes/comunes/dato-ficha';
import { InsigniaActivo } from '@/componentes/comunes/insignia-activo';
import { InsigniaCuentaCorriente } from '@/componentes/dominio/clientes/insignia-cuenta-corriente';
import { Grilla, Pila, Texto } from '@/componentes/primitivas';
import { Card, CardContent } from '@/componentes/ui/card';
import {
  SEPARADOR_DATOS,
  SIN_REFERENCIA,
  TEXTO_SIN_LIMITE,
} from '@/constantes/interfaz';
import { formatearMoneda } from '@/lib/formato';
import { tieneValor } from '@/lib/valores';
import type { Cliente } from '@/servicios/clientes';

function importeOSinLimite(importe: number | null) {
  return tieneValor(importe) ? formatearMoneda(importe) : TEXTO_SIN_LIMITE;
}

export function FichaCliente({ cliente }: { cliente: Cliente }) {
  const contacto = [cliente.domicilio, cliente.telefono, cliente.email]
    .filter(Boolean)
    .join(SEPARADOR_DATOS);

  return (
    <Card>
      <CardContent>
        <Pila espacio={4}>
          <Grilla columnas={4}>
            <DatoFicha etiqueta="Saldo">
              {formatearMoneda(cliente.saldo)}
            </DatoFicha>
            <DatoFicha etiqueta="Límite de crédito">
              {importeOSinLimite(cliente.limiteCredito)}
            </DatoFicha>
            <DatoFicha etiqueta="Disponible">
              {importeOSinLimite(cliente.disponible)}
            </DatoFicha>
            <DatoFicha etiqueta="Cuenta corriente">
              <InsigniaCuentaCorriente habilitada={cliente.cuentaCorriente} />
            </DatoFicha>
            <DatoFicha etiqueta="Estado">
              <InsigniaActivo activo={cliente.activo} />
            </DatoFicha>
          </Grilla>
          <Texto tono="suave">{contacto || SIN_REFERENCIA}</Texto>
        </Pila>
      </CardContent>
    </Card>
  );
}
