'use client';

import { DialogoFormulario } from '@/componentes/comunes/dialogo-formulario';
import { FormularioAltaCategoria } from '@/componentes/dominio/productos/categorias/formulario-alta-categoria';
import { BotonNuevo } from '@/componentes/comunes/boton-nuevo';

export function BotonNuevaCategoria() {
  return (
    <DialogoFormulario
      titulo="Nueva categoría"
      disparador={<BotonNuevo texto="Nueva categoría" />}
    >
      {(cerrar) => <FormularioAltaCategoria alGuardar={cerrar} />}
    </DialogoFormulario>
  );
}
