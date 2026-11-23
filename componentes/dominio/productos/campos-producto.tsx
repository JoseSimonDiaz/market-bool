'use client';

import { Grilla } from '@/componentes/primitivas';
import { PRODUCTO_SIN_DATOS, SIN_CATEGORIAS } from '@/constantes/formularios';
import { crearGrupoDeCampos } from '@/hooks/formulario/app';

export const CamposProducto = crearGrupoDeCampos({
  defaultValues: PRODUCTO_SIN_DATOS,
  props: { categorias: SIN_CATEGORIAS },
  render: function CamposDeProducto({ group: grupo, categorias }) {
    return (
      <>
        <Grilla>
          <grupo.AppField name="codigo">
            {(campo) => (
              <campo.CampoTexto etiqueta="Código" placeholder="BS-004" />
            )}
          </grupo.AppField>
          <grupo.AppField name="categoriaId">
            {(campo) => (
              <campo.CampoSeleccionNumerica
                etiqueta="Categoría"
                opciones={categorias}
              />
            )}
          </grupo.AppField>
        </Grilla>
        <grupo.AppField name="descripcion">
          {(campo) => <campo.CampoTexto etiqueta="Descripción" />}
        </grupo.AppField>
        <Grilla>
          <grupo.AppField name="precio">
            {(campo) => <campo.CampoImporte etiqueta="Precio de venta" />}
          </grupo.AppField>
          <grupo.AppField name="stockMinimo">
            {(campo) => <campo.CampoEntero etiqueta="Stock mínimo" />}
          </grupo.AppField>
        </Grilla>
      </>
    );
  },
});
