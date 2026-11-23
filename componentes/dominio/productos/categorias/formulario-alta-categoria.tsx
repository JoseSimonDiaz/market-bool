'use client';

import { accionCrearCategoria } from '@/acciones/productos';
import { CATEGORIA_NUEVA } from '@/constantes/formularios';
import { esquemaAltaCategoria } from '@/esquemas/productos';
import { useFormulario } from '@/hooks/usar-formulario';

export function FormularioAltaCategoria({
  alGuardar,
}: {
  alGuardar: () => void;
}) {
  const formulario = useFormulario({
    valoresIniciales: CATEGORIA_NUEVA,
    esquema: esquemaAltaCategoria,
    enviar: accionCrearCategoria,
    mensajeExito: 'Categoría creada.',
    alExito: alGuardar,
  });

  return (
    <formulario.AppForm>
      <formulario.Formulario>
        <formulario.AppField name="nombre">
          {(campo) => <campo.CampoTexto etiqueta="Nombre" />}
        </formulario.AppField>
        <formulario.BotonEnviar>Crear categoría</formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
