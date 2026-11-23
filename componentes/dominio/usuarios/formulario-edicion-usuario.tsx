'use client';

import { useCallback } from 'react';
import { accionEditarUsuario } from '@/acciones/usuarios';
import { CamposUsuario } from '@/componentes/dominio/usuarios/campos-usuario';
import {
  CAMPOS_COMUNES_USUARIO,
  type CamposComunesUsuario,
} from '@/constantes/formularios';
import { esquemaEdicionUsuario } from '@/esquemas/usuarios';
import { useFormulario } from '@/hooks/usar-formulario';
import type { Usuario } from '@/servicios/usuarios';

export function FormularioEdicionUsuario({
  usuario,
  alGuardar,
}: {
  usuario: Usuario;
  alGuardar: () => void;
}) {
  const guardarCambios = useCallback(
    (cambios: CamposComunesUsuario) => accionEditarUsuario(usuario.id, cambios),
    [usuario.id]
  );
  const { nombre, email, rol } = usuario;
  const formulario = useFormulario({
    valoresIniciales: { nombre, email, rol },
    esquema: esquemaEdicionUsuario,
    enviar: guardarCambios,
    mensajeExito: 'Usuario actualizado.',
    alExito: alGuardar,
  });

  return (
    <formulario.AppForm>
      <formulario.Formulario>
        <CamposUsuario form={formulario} fields={CAMPOS_COMUNES_USUARIO} />
        <formulario.BotonEnviar>Guardar cambios</formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
