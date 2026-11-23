'use client';

import { useCallback } from 'react';
import { accionAnularFactura } from '@/acciones/ventas';
import {
  ANULACION_NUEVA,
  type CamposAnulacion,
} from '@/constantes/formularios';
import { esquemaAnulacion } from '@/esquemas/facturas';
import { useFormulario } from '@/hooks/usar-formulario';

export function FormularioAnulacion({
  facturaId,
  alAnular,
}: {
  facturaId: number;
  alAnular: () => void;
}) {
  const anular = useCallback(
    (anulacion: CamposAnulacion) => accionAnularFactura(facturaId, anulacion),
    [facturaId]
  );
  const formulario = useFormulario({
    valoresIniciales: ANULACION_NUEVA,
    esquema: esquemaAnulacion,
    enviar: anular,
    mensajeExito: 'Factura anulada.',
    alExito: alAnular,
  });

  return (
    <formulario.AppForm>
      <formulario.Formulario>
        <formulario.AppField name="motivo">
          {(campo) => (
            <campo.CampoAreaTexto etiqueta="Motivo de la anulación" />
          )}
        </formulario.AppField>
        <formulario.BotonEnviar>Anular factura</formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
