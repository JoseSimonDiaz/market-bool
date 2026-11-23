'use client';

import { Grilla } from '@/componentes/primitivas';
import { CLIENTE_NUEVO } from '@/constantes/formularios';
import { OPCIONES_TIPO_DOCUMENTO } from '@/constantes/opciones';
import { crearGrupoDeCampos } from '@/hooks/formulario/app';

export const CamposCliente = crearGrupoDeCampos({
  defaultValues: CLIENTE_NUEVO,
  render: function CamposDeCliente({ group: grupo }) {
    return (
      <>
        <Grilla>
          <grupo.AppField name="tipoDoc">
            {(campo) => (
              <campo.CampoSeleccion
                etiqueta="Tipo de documento"
                opciones={OPCIONES_TIPO_DOCUMENTO}
              />
            )}
          </grupo.AppField>
          <grupo.AppField name="nroDoc">
            {(campo) => (
              <campo.CampoTexto etiqueta="Número" placeholder="28.456.123" />
            )}
          </grupo.AppField>
        </Grilla>
        <grupo.AppField name="nombre">
          {(campo) => <campo.CampoTexto etiqueta="Nombre o razón social" />}
        </grupo.AppField>
        <grupo.AppField name="domicilio">
          {(campo) => <campo.CampoTexto etiqueta="Domicilio" />}
        </grupo.AppField>
        <Grilla>
          <grupo.AppField name="telefono">
            {(campo) => <campo.CampoTexto etiqueta="Teléfono" />}
          </grupo.AppField>
          <grupo.AppField name="email">
            {(campo) => <campo.CampoTexto etiqueta="Email" tipo="email" />}
          </grupo.AppField>
        </Grilla>
        <grupo.AppField name="cuentaCorriente">
          {(campo) => (
            <campo.CampoInterruptor
              etiqueta="Habilitado para cuenta corriente"
              ayuda="Puede comprar a cuenta y pagar después."
            />
          )}
        </grupo.AppField>
        <grupo.AppField name="limiteCredito">
          {(campo) => (
            <campo.CampoImporte
              etiqueta="Límite de crédito"
              ayuda="Vacío si no tiene límite."
            />
          )}
        </grupo.AppField>
      </>
    );
  },
});
