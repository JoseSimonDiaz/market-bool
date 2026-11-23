'use client';

import { useCallback } from 'react';
import { CREDENCIALES_VACIAS } from '@/constantes/formularios';
import { METODO_HTTP } from '@/constantes/http';
import { RUTAS, RUTAS_API } from '@/constantes/rutas';
import {
  esquemaLogin,
  type DatosLogin,
  type UsuarioSesion,
} from '@/esquemas/usuarios';
import { useFormulario } from '@/hooks/usar-formulario';
import { llamarApi } from '@/adaptadores/cliente-api';

function enviarCredenciales(credenciales: DatosLogin) {
  return llamarApi<UsuarioSesion>(
    RUTAS_API.login,
    METODO_HTTP.post,
    credenciales
  );
}

export function FormularioLogin() {
  const irAlInicio = useCallback(
    () => window.location.assign(RUTAS.inicio),
    []
  );
  const formulario = useFormulario({
    valoresIniciales: CREDENCIALES_VACIAS,
    esquema: esquemaLogin,
    enviar: enviarCredenciales,
    alExito: irAlInicio,
  });

  return (
    <formulario.AppForm>
      <formulario.Formulario>
        <formulario.AppField name="email">
          {(campo) => (
            <campo.CampoTexto
              etiqueta="Email"
              tipo="email"
              autoComplete="username"
            />
          )}
        </formulario.AppField>
        <formulario.AppField name="password">
          {(campo) => (
            <campo.CampoTexto
              etiqueta="Contraseña"
              tipo="password"
              autoComplete="current-password"
            />
          )}
        </formulario.AppField>
        <formulario.BotonEnviar>Ingresar</formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
