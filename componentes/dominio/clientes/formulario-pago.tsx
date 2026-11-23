'use client';

import { useCallback } from 'react';
import { accionRegistrarPago } from '@/acciones/clientes';
import { PAGO_NUEVO, type CamposPago } from '@/constantes/formularios';
import { OPCIONES_MEDIO_PAGO } from '@/constantes/opciones';
import { esquemaPago } from '@/esquemas/clientes';
import { useFormulario } from '@/hooks/usar-formulario';
import type { Recibo } from '@/servicios/pagos';

export function FormularioPago({
  clienteId,
  alGuardar,
}: {
  clienteId: number;
  alGuardar: (recibo: Recibo) => void;
}) {
  const registrar = useCallback(
    (pago: CamposPago) => accionRegistrarPago(clienteId, pago),
    [clienteId]
  );
  const formulario = useFormulario({
    valoresIniciales: PAGO_NUEVO,
    esquema: esquemaPago,
    enviar: registrar,
    mensajeExito: 'Pago registrado.',
    alExito: alGuardar,
  });

  return (
    <formulario.AppForm>
      <formulario.Formulario>
        <formulario.AppField name="importe">
          {(campo) => <campo.CampoImporte etiqueta="Importe" />}
        </formulario.AppField>
        <formulario.AppField name="medio">
          {(campo) => (
            <campo.CampoSeleccion
              etiqueta="Medio de pago"
              opciones={OPCIONES_MEDIO_PAGO}
            />
          )}
        </formulario.AppField>
        <formulario.AppField name="observacion">
          {(campo) => <campo.CampoAreaTexto etiqueta="Observación" />}
        </formulario.AppField>
        <formulario.BotonEnviar>Registrar pago</formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
