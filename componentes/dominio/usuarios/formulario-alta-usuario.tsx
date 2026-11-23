'use client';

import { accionCrearUsuario } from '@/acciones/usuarios';
import { CamposUsuario } from '@/componentes/dominio/usuarios/campos-usuario';
import {
  CAMPOS_COMUNES_USUARIO,
  USUARIO_NUEVO,
} from '@/constantes/formularios';
import { esquemaAltaUsuario } from '@/esquemas/usuarios';
import { useFormulario } from '@/hooks/usar-formulario';

export function FormularioAltaUsuario({
  alGuardar,
}: {
  alGuardar: () => void;
}) {
  const formulario = useFormulario({
    valoresIniciales: USUARIO_NUEVO,
    esquema: esquemaAltaUsuario,
    enviar: accionCrearUsuario,
    mensajeExito: 'Usuario creado.',
    alExito: alGuardar,
  });

  return (
    <formulario.AppForm>
      <formulario.Formulario>
        <CamposUsuario form={formulario} fields={CAMPOS_COMUNES_USUARIO} />
        <formulario.AppField name="password">
          {(campo) => (
            <campo.CampoTexto
              etiqueta="Contraseña temporal"
              tipo="password"
              autoComplete="new-password"
              ayuda="Mínimo 8 caracteres. El usuario la cambia desde su perfil."
            />
          )}
        </formulario.AppField>
        <formulario.BotonEnviar>Crear usuario</formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
