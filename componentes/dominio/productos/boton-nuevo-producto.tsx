'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { DialogoFormulario } from '@/componentes/comunes/dialogo-formulario';
import type { Opcion } from '@/lib/opciones';
import { FormularioAltaProducto } from '@/componentes/dominio/productos/formulario-alta-producto';
import { BotonNuevo } from '@/componentes/comunes/boton-nuevo';
import { RUTAS } from '@/constantes/rutas';
import type { Producto } from '@/servicios/productos';

export function BotonNuevoProducto({
  categorias,
}: {
  categorias: Opcion<number>[];
}) {
  const enrutador = useRouter();
  const abrirFicha = useCallback(
    (producto: Producto) => enrutador.push(RUTAS.producto(producto.id)),
    [enrutador]
  );

  return (
    <DialogoFormulario
      titulo="Nuevo producto"
      descripcion="Carta, sobre o accesorio del catálogo."
      disparador={<BotonNuevo texto="Nuevo producto" />}
    >
      {() => (
        <FormularioAltaProducto
          categorias={categorias}
          alGuardar={abrirFicha}
        />
      )}
    </DialogoFormulario>
  );
}
