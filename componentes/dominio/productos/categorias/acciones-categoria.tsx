'use client';

import { PencilIcon } from 'lucide-react';
import { useCallback } from 'react';
import { accionEditarCategoria } from '@/acciones/productos';
import { BotonIconoCambiarEstado } from '@/componentes/comunes/boton-cambiar-estado';
import { DialogoFormulario } from '@/componentes/comunes/dialogo-formulario';
import { FormularioEdicionCategoria } from '@/componentes/dominio/productos/categorias/formulario-edicion-categoria';
import { BotonIcono } from '@/componentes/comunes/boton-icono';
import { TEXTOS_ESTADO_CATEGORIA } from '@/constantes/etiquetas';
import type { Categoria } from '@/servicios/categorias';

export function AccionesCategoria({ categoria }: { categoria: Categoria }) {
  const cambiarEstado = useCallback(
    (activar: boolean) =>
      accionEditarCategoria(categoria.id, { activa: activar }),
    [categoria.id]
  );

  return (
    <div className="flex justify-end gap-1">
      <DialogoFormulario
        titulo="Editar categoría"
        disparador={<BotonIcono icono={PencilIcon} etiqueta="Editar" />}
      >
        {(cerrar) => (
          <FormularioEdicionCategoria
            categoria={categoria}
            alGuardar={cerrar}
          />
        )}
      </DialogoFormulario>
      <BotonIconoCambiarEstado
        activo={categoria.activa}
        textos={TEXTOS_ESTADO_CATEGORIA}
        cambiarEstado={cambiarEstado}
      />
    </div>
  );
}
