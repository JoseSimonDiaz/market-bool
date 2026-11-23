'use client';

import { PencilIcon } from 'lucide-react';
import { BotonConIcono } from '@/componentes/comunes/boton-icono';
import { DialogoFormulario } from '@/componentes/comunes/dialogo-formulario';
import { FormularioEdicionCliente } from '@/componentes/dominio/clientes/formulario-edicion-cliente';
import type { Cliente } from '@/servicios/clientes';

export function BotonEditarCliente({ cliente }: { cliente: Cliente }) {
  return (
    <DialogoFormulario
      titulo="Editar cliente"
      disparador={<BotonConIcono icono={PencilIcon} etiqueta="Editar" />}
    >
      {(cerrar) => (
        <FormularioEdicionCliente cliente={cliente} alGuardar={cerrar} />
      )}
    </DialogoFormulario>
  );
}
