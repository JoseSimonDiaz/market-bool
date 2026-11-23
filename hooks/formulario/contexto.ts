import { createFormHookContexts as crearContextosDeFormulario } from '@tanstack/react-form';

export const {
  fieldContext: contextoCampo,
  formContext: contextoFormulario,
  useFieldContext: useCampoActual,
  useFormContext: useFormularioActual,
} = crearContextosDeFormulario();

export type ErrorDeCampo = { message: string };
