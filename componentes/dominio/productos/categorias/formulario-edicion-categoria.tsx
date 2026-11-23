'use client';

import { useCallback } from 'react';
import { accionEditarCategoria } from '@/acciones/productos';
import {
  esquemaEdicionCategoria,
  type DatosEdicionCategoria,
} from '@/esquemas/productos';
import { useFormulario } from '@/hooks/usar-formulario';
import type { Categoria } from '@/servicios/categorias';

export function FormularioEdicionCategoria({
  categoria,
  alGuardar,
}: {
  categoria: Categoria;
  alGuardar: () => void;
}) {
  const guardarCambios = useCallback(
    (cambios: DatosEdicionCategoria) =>
      accionEditarCategoria(categoria.id, cambios),
    [categoria.id]
  );
  const datosActuales: DatosEdicionCategoria = { nombre: categoria.nombre };
  const formulario = useFormulario({
    valoresIniciales: datosActuales,
    esquema: esquemaEdicionCategoria,
    enviar: guardarCambios,
    mensajeExito: 'Categoría actualizada.',
    alExito: alGuardar,
  });

  return (
    <formulario.AppForm>
      <formulario.Formulario>
        <formulario.AppField name="nombre">
          {(campo) => <campo.CampoTexto etiqueta="Nombre" />}
        </formulario.AppField>
        <formulario.BotonEnviar>Guardar cambios</formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
