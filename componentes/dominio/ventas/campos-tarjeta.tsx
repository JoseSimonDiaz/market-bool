'use client';

import { Grilla } from '@/componentes/primitivas';
import { OPCIONES_TIPO_TARJETA } from '@/constantes/opciones';
import type { FormularioDeVenta } from '@/hooks/usar-formulario-de-venta';

export function CamposTarjeta({
  formulario,
}: {
  formulario: FormularioDeVenta;
}) {
  return (
    <>
      <Grilla>
        <formulario.AppField name="tarjetaTipo">
          {(campo) => (
            <campo.CampoSeleccion
              etiqueta="Tipo de tarjeta"
              opciones={OPCIONES_TIPO_TARJETA}
            />
          )}
        </formulario.AppField>
        <formulario.AppField name="tarjetaMarca">
          {(campo) => <campo.CampoTexto etiqueta="Marca" placeholder="Visa" />}
        </formulario.AppField>
      </Grilla>
      <formulario.AppField name="tarjetaUltimos4">
        {(campo) => (
          <campo.CampoTexto
            etiqueta="Últimos 4 dígitos"
            placeholder="4242"
            ayuda="Nunca se pide ni se guarda el número completo."
          />
        )}
      </formulario.AppField>
    </>
  );
}
