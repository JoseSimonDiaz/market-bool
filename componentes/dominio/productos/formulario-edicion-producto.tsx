'use client';

import { useCallback } from 'react';
import { accionEditarProducto } from '@/acciones/productos';
import type { Opcion } from '@/lib/opciones';
import { CamposProducto } from '@/componentes/dominio/productos/campos-producto';
import {
  CAMPOS_COMUNES_PRODUCTO,
  type CamposComunesProducto,
} from '@/constantes/formularios';
import { esquemaEdicionProducto } from '@/esquemas/productos';
import { useFormulario } from '@/hooks/usar-formulario';
import type { Producto } from '@/servicios/productos';

function datosEditables(producto: Producto): CamposComunesProducto {
  return {
    codigo: producto.codigo,
    descripcion: producto.descripcion,
    categoriaId: producto.categoria.id,
    precio: producto.precio,
    stockMinimo: producto.stockMinimo,
  };
}

export function FormularioEdicionProducto({
  producto,
  categorias,
  alGuardar,
}: {
  producto: Producto;
  categorias: Opcion<number>[];
  alGuardar: () => void;
}) {
  const guardarCambios = useCallback(
    (cambios: CamposComunesProducto) =>
      accionEditarProducto(producto.id, cambios),
    [producto.id]
  );
  const formulario = useFormulario({
    valoresIniciales: datosEditables(producto),
    esquema: esquemaEdicionProducto,
    enviar: guardarCambios,
    mensajeExito: 'Producto actualizado.',
    alExito: alGuardar,
  });

  return (
    <formulario.AppForm>
      <formulario.Formulario>
        <CamposProducto
          form={formulario}
          fields={CAMPOS_COMUNES_PRODUCTO}
          categorias={categorias}
        />
        <formulario.BotonEnviar>Guardar cambios</formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
