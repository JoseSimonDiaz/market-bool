'use client';

import { PencilIcon } from 'lucide-react';
import { DialogoFormulario } from '@/componentes/comunes/dialogo-formulario';
import { FormularioEdicionUsuario } from '@/componentes/dominio/usuarios/formulario-edicion-usuario';
import { BotonIcono } from '@/componentes/comunes/boton-icono';
import type { Usuario } from '@/servicios/usuarios';

export function BotonEditarUsuario({ usuario }: { usuario: Usuario }) {
  return (
    <DialogoFormulario
      titulo="Editar usuario"
      disparador={<BotonIcono icono={PencilIcon} etiqueta="Editar" />}
    >
      {(cerrar) => (
        <FormularioEdicionUsuario usuario={usuario} alGuardar={cerrar} />
      )}
    </DialogoFormulario>
  );
}
