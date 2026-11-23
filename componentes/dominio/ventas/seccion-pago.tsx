'use client';

import { useStore } from '@tanstack/react-form';
import { CamposDeLaForma } from '@/componentes/dominio/ventas/campos-de-la-forma';
import { Pila, Texto, Titulo } from '@/componentes/primitivas';
import { Card, CardContent } from '@/componentes/ui/card';
import {
  OPCIONES_FORMA_PAGO,
  OPCIONES_FORMA_PAGO_SIN_CUENTA_CORRIENTE,
} from '@/constantes/opciones';
import type { FormularioDeVenta } from '@/hooks/usar-formulario-de-venta';
import { formatearMoneda } from '@/lib/formato';
import type { Cliente } from '@/servicios/clientes';

export function SeccionPago({
  formulario,
  comprador,
  total,
}: {
  formulario: FormularioDeVenta;
  comprador: Cliente | null;
  total: number;
}) {
  const forma = useStore(formulario.store, (estado) => estado.values.forma);
  const opcionesDeForma = comprador?.cuentaCorriente
    ? OPCIONES_FORMA_PAGO
    : OPCIONES_FORMA_PAGO_SIN_CUENTA_CORRIENTE;

  return (
    <Card>
      <CardContent>
        <formulario.AppForm>
          <formulario.Formulario>
            <Titulo nivel={2}>Pago</Titulo>
            <formulario.AppField name="forma">
              {(campo) => (
                <campo.CampoSeleccion
                  etiqueta="Forma de pago"
                  opciones={opcionesDeForma}
                />
              )}
            </formulario.AppField>
            <CamposDeLaForma
              forma={forma}
              formulario={formulario}
              comprador={comprador}
              total={total}
            />
            <Pila espacio={1}>
              <Texto tono="suave">Total</Texto>
              <p className="text-3xl font-semibold tabular-nums">
                {formatearMoneda(total)}
              </p>
            </Pila>
            <formulario.BotonEnviar>Confirmar venta</formulario.BotonEnviar>
          </formulario.Formulario>
        </formulario.AppForm>
      </CardContent>
    </Card>
  );
}
