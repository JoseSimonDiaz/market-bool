'use client';

import { useCallback } from 'react';
import { accionMoverStock } from '@/acciones/productos';
import { Grilla, Texto } from '@/componentes/primitivas';
import { MOVIMIENTO_NUEVO } from '@/constantes/formularios';
import { TEXTOS_MOVIMIENTO_MANUAL } from '@/constantes/interfaz';
import { OPCIONES_DE_MOTIVO } from '@/constantes/opciones';
import {
  esquemaMovimientoManual,
  type DatosMovimientoManual,
  type TipoMovimientoManual,
} from '@/esquemas/productos';
import { useFormulario } from '@/hooks/usar-formulario';
import { formatearEntero } from '@/lib/formato';

type PropsFormularioMovimiento = {
  productoId: number;
  tipo: TipoMovimientoManual;
  existencia: number;
  alGuardar: () => void;
};

function useFormularioMovimiento({
  productoId,
  tipo,
  alGuardar,
}: PropsFormularioMovimiento) {
  const registrar = useCallback(
    (movimiento: DatosMovimientoManual) =>
      accionMoverStock(productoId, movimiento),
    [productoId]
  );
  return useFormulario({
    valoresIniciales: MOVIMIENTO_NUEVO[tipo],
    esquema: esquemaMovimientoManual,
    enviar: registrar,
    mensajeExito: 'Movimiento registrado.',
    alExito: alGuardar,
  });
}

export function FormularioMovimiento(props: PropsFormularioMovimiento) {
  const { tipo, existencia } = props;
  const formulario = useFormularioMovimiento(props);

  return (
    <formulario.AppForm>
      <formulario.Formulario>
        <Texto tono="suave">
          Existencia actual: {formatearEntero(existencia)} unidades.
        </Texto>
        <Grilla>
          <formulario.AppField name="cantidad">
            {(campo) => <campo.CampoEntero etiqueta="Cantidad" />}
          </formulario.AppField>
          <formulario.AppField name="motivo">
            {(campo) => (
              <campo.CampoSeleccion
                etiqueta="Motivo"
                opciones={OPCIONES_DE_MOTIVO[tipo]}
              />
            )}
          </formulario.AppField>
        </Grilla>
        <formulario.AppField name="observacion">
          {(campo) => (
            <campo.CampoAreaTexto etiqueta="Observación (opcional)" />
          )}
        </formulario.AppField>
        <formulario.BotonEnviar>
          {TEXTOS_MOVIMIENTO_MANUAL[tipo].boton}
        </formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
