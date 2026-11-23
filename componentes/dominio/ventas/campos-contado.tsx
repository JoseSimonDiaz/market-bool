'use client';

import { useStore } from '@tanstack/react-form';
import { Texto } from '@/componentes/primitivas';
import type { FormularioDeVenta } from '@/hooks/usar-formulario-de-venta';
import { formatearMoneda } from '@/lib/formato';
import { calcularVuelto } from '@/lib/ventas';

export function CamposContado({
  formulario,
  total,
}: {
  formulario: FormularioDeVenta;
  total: number;
}) {
  const montoRecibido = useStore(
    formulario.store,
    (estado) => estado.values.montoRecibido
  );
  const montoACobrar = Number.isFinite(montoRecibido) ? montoRecibido : total;
  const vuelto = formatearMoneda(calcularVuelto(montoACobrar, total));

  return (
    <>
      <formulario.AppField name="montoRecibido">
        {(campo) => (
          <campo.CampoImporte
            etiqueta="Monto recibido"
            ayuda="Vacío si paga el total justo."
          />
        )}
      </formulario.AppField>
      <Texto>Vuelto: {vuelto}</Texto>
    </>
  );
}
