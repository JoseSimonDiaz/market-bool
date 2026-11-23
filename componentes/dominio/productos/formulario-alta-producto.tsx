'use client';

import { accionCrearProducto } from '@/acciones/productos';
import type { Opcion } from '@/lib/opciones';
import { CamposProducto } from '@/componentes/dominio/productos/campos-producto';
import {
  CAMPOS_COMUNES_PRODUCTO,
  PRODUCTO_NUEVO,
} from '@/constantes/formularios';
import { esquemaAltaProducto } from '@/esquemas/productos';
import { useFormulario } from '@/hooks/usar-formulario';
import type { Producto } from '@/servicios/productos';

export function FormularioAltaProducto({
  categorias,
  alGuardar,
}: {
  categorias: Opcion<number>[];
  alGuardar: (producto: Producto) => void;
}) {
  const formulario = useFormulario({
    valoresIniciales: PRODUCTO_NUEVO,
    esquema: esquemaAltaProducto,
    enviar: accionCrearProducto,
    mensajeExito: 'Producto creado.',
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
        <formulario.AppField name="stockInicial">
          {(campo) => <campo.CampoEntero etiqueta="Stock inicial" />}
        </formulario.AppField>
        <formulario.BotonEnviar>Crear producto</formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
