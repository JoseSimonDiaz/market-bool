'use client';

import { createFormHook as crearHookDeFormulario } from '@tanstack/react-form';
import { BotonEnviar } from '@/componentes/comunes/campos/boton-enviar';
import { CampoAreaTexto } from '@/componentes/comunes/campos/campo-area-texto';
import { CampoEntero } from '@/componentes/comunes/campos/campo-entero';
import { CampoImporte } from '@/componentes/comunes/campos/campo-importe';
import { CampoInterruptor } from '@/componentes/comunes/campos/campo-interruptor';
import { CampoSeleccion } from '@/componentes/comunes/campos/campo-seleccion';
import { CampoSeleccionNumerica } from '@/componentes/comunes/campos/campo-seleccion-numerica';
import { CampoTexto } from '@/componentes/comunes/campos/campo-texto';
import { Formulario } from '@/componentes/comunes/campos/formulario';
import { contextoCampo, contextoFormulario } from '@/hooks/formulario/contexto';

export const {
  useAppForm: useFormularioDeLaApp,
  withFieldGroup: crearGrupoDeCampos,
} = crearHookDeFormulario({
  fieldContext: contextoCampo,
  formContext: contextoFormulario,
  fieldComponents: {
    CampoTexto,
    CampoAreaTexto,
    CampoEntero,
    CampoImporte,
    CampoInterruptor,
    CampoSeleccion,
    CampoSeleccionNumerica,
  },
  formComponents: { Formulario, BotonEnviar },
});
