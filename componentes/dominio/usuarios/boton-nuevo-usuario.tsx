'use client';

import { DialogoFormulario } from '@/componentes/comunes/dialogo-formulario';
import { FormularioAltaUsuario } from '@/componentes/dominio/usuarios/formulario-alta-usuario';
import { BotonNuevo } from '@/componentes/comunes/boton-nuevo';

export function BotonNuevoUsuario() {
  return (
    <DialogoFormulario
      titulo="Nuevo usuario"
      disparador={<BotonNuevo texto="Nuevo usuario" />}
    >
      {(cerrar) => <FormularioAltaUsuario alGuardar={cerrar} />}
    </DialogoFormulario>
  );
}
