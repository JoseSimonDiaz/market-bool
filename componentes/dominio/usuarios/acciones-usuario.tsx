'use client';

import { useCallback } from 'react';
import { accionEditarUsuario } from '@/acciones/usuarios';
import { BotonIconoCambiarEstado } from '@/componentes/comunes/boton-cambiar-estado';
import { BotonEditarUsuario } from '@/componentes/dominio/usuarios/boton-editar-usuario';
import { BotonRestablecerPassword } from '@/componentes/dominio/usuarios/boton-restablecer-password';
import { TEXTOS_ESTADO_USUARIO } from '@/constantes/etiquetas';
import type { Usuario } from '@/servicios/usuarios';

export function AccionesUsuario({
  usuario,
  esUsuarioActual,
}: {
  usuario: Usuario;
  esUsuarioActual: boolean;
}) {
  const cambiarEstado = useCallback(
    (activar: boolean) => accionEditarUsuario(usuario.id, { activo: activar }),
    [usuario.id]
  );

  return (
    <div className="flex justify-end gap-1">
      <BotonEditarUsuario usuario={usuario} />
      <BotonRestablecerPassword usuario={usuario} />
      {!esUsuarioActual && (
        <BotonIconoCambiarEstado
          activo={usuario.activo}
          textos={TEXTOS_ESTADO_USUARIO}
          cambiarEstado={cambiarEstado}
        />
      )}
    </div>
  );
}
