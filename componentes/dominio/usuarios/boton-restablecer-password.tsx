'use client';

import { KeyRoundIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { accionRestablecerPassword } from '@/acciones/usuarios';
import { ConfirmarAccion } from '@/componentes/comunes/confirmar-accion';
import { DialogoPasswordTemporal } from '@/componentes/dominio/usuarios/dialogo-password-temporal';
import { BotonIcono } from '@/componentes/comunes/boton-icono';
import { GRAVEDAD } from '@/constantes/interfaz';
import type { Usuario } from '@/servicios/usuarios';

export function BotonRestablecerPassword({ usuario }: { usuario: Usuario }) {
  const [passwordTemporal, setPasswordTemporal] = useState('');
  const restablecer = useCallback(
    () => accionRestablecerPassword(usuario.id),
    [usuario.id]
  );
  const mostrarPassword = useCallback(
    (respuesta: { passwordTemporal: string }) =>
      setPasswordTemporal(respuesta.passwordTemporal),
    []
  );
  const ocultarPassword = useCallback(() => setPasswordTemporal(''), []);
  const textos = {
    titulo: 'Restablecer contraseña',
    descripcion: `Se genera una contraseña temporal para ${usuario.nombre}. La actual deja de funcionar.`,
    accion: 'Restablecer',
    mensajeExito: 'Contraseña restablecida.',
  };

  return (
    <>
      <ConfirmarAccion
        disparador={
          <BotonIcono icono={KeyRoundIcon} etiqueta="Restablecer contraseña" />
        }
        textos={textos}
        gravedad={GRAVEDAD.irreversible}
        ejecutar={restablecer}
        alConfirmar={mostrarPassword}
      />
      <DialogoPasswordTemporal
        nombreUsuario={usuario.nombre}
        passwordTemporal={passwordTemporal}
        alCerrar={ocultarPassword}
      />
    </>
  );
}
