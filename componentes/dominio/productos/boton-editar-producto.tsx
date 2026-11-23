'use client';

import { PencilIcon } from 'lucide-react';
import { DialogoFormulario } from '@/componentes/comunes/dialogo-formulario';
import type { Opcion } from '@/lib/opciones';
import { FormularioEdicionProducto } from '@/componentes/dominio/productos/formulario-edicion-producto';
import { BotonConIcono } from '@/componentes/comunes/boton-icono';
import type { Producto } from '@/servicios/productos';

export function BotonEditarProducto({
  producto,
  categorias,
}: {
  producto: Producto;
  categorias: Opcion<number>[];
}) {
  return (
    <DialogoFormulario
      titulo="Editar producto"
      disparador={<BotonConIcono icono={PencilIcon} etiqueta="Editar" />}
    >
      {(cerrar) => (
        <FormularioEdicionProducto
          producto={producto}
          categorias={categorias}
          alGuardar={cerrar}
        />
      )}
    </DialogoFormulario>
  );
}
