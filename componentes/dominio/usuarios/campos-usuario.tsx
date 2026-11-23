'use client';

import { USUARIO_SIN_DATOS } from '@/constantes/formularios';
import { OPCIONES_ROL } from '@/constantes/opciones';
import { crearGrupoDeCampos } from '@/hooks/formulario/app';

export const CamposUsuario = crearGrupoDeCampos({
  defaultValues: USUARIO_SIN_DATOS,
  render: function CamposDeUsuario({ group: grupo }) {
    return (
      <>
        <grupo.AppField name="nombre">
          {(campo) => <campo.CampoTexto etiqueta="Nombre" />}
        </grupo.AppField>
        <grupo.AppField name="email">
          {(campo) => <campo.CampoTexto etiqueta="Email" tipo="email" />}
        </grupo.AppField>
        <grupo.AppField name="rol">
          {(campo) => (
            <campo.CampoSeleccion etiqueta="Rol" opciones={OPCIONES_ROL} />
          )}
        </grupo.AppField>
      </>
    );
  },
});
