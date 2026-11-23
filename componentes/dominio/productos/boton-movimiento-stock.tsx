'use client';

import { BotonConIcono } from '@/componentes/comunes/boton-icono';
import { DialogoFormulario } from '@/componentes/comunes/dialogo-formulario';
import { FormularioMovimiento } from '@/componentes/dominio/productos/formulario-movimiento';
import { TEXTOS_MOVIMIENTO_MANUAL } from '@/constantes/interfaz';
import { ICONO_SEGUN_MOVIMIENTO } from '@/constantes/navegacion';
import type { TipoMovimientoManual } from '@/esquemas/productos';
import type { Producto } from '@/servicios/productos';

export function BotonMovimientoStock({
  producto,
  tipo,
}: {
  producto: Producto;
  tipo: TipoMovimientoManual;
}) {
  const { titulo, etiqueta } = TEXTOS_MOVIMIENTO_MANUAL[tipo];
  const disparador = (
    <BotonConIcono
      icono={ICONO_SEGUN_MOVIMIENTO[tipo]}
      etiqueta={etiqueta}
      disabled={!producto.activo}
    />
  );

  return (
    <DialogoFormulario titulo={titulo} disparador={disparador}>
      {(cerrar) => (
        <FormularioMovimiento
          productoId={producto.id}
          tipo={tipo}
          existencia={producto.existencia}
          alGuardar={cerrar}
        />
      )}
    </DialogoFormulario>
  );
}
