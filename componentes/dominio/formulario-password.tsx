'use client';

import { accionCambiarPassword } from '@/acciones/auth';
import { PASSWORDS_VACIAS } from '@/constantes/formularios';
import { esquemaCambioPassword } from '@/esquemas/usuarios';
import { useFormulario } from '@/hooks/usar-formulario';

export function FormularioPassword() {
  const formulario = useFormulario({
    valoresIniciales: PASSWORDS_VACIAS,
    esquema: esquemaCambioPassword,
    enviar: accionCambiarPassword,
    mensajeExito: 'Contraseña actualizada.',
  });

  return (
    <formulario.AppForm>
      <formulario.Formulario>
        <formulario.AppField name="actual">
          {(campo) => (
            <campo.CampoTexto
              etiqueta="Contraseña actual"
              tipo="password"
              autoComplete="current-password"
            />
          )}
        </formulario.AppField>
        <formulario.AppField name="nueva">
          {(campo) => (
            <campo.CampoTexto
              etiqueta="Contraseña nueva"
              tipo="password"
              autoComplete="new-password"
              ayuda="Mínimo 8 caracteres."
            />
          )}
        </formulario.AppField>
        <formulario.BotonEnviar>Cambiar contraseña</formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
