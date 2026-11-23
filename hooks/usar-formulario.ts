'use client';

import type { AnyFieldLikeMetaBase, DeepKeys } from '@tanstack/react-form';
import { toast as aviso } from 'sonner';
import type { ZodType } from 'zod';
import type { ResultadoAccion } from '@/adaptadores/acciones';
import { useFormularioDeLaApp } from '@/hooks/formulario/app';
import {
  detallesDelServidor,
  validarConEsquema,
} from '@/hooks/formulario/errores';

type Envio<Valores, Respuesta> = {
  enviar: (valores: Valores) => Promise<ResultadoAccion<Respuesta>>;
  mensajeExito?: string;
  alExito?: (respuesta: Respuesta) => void;
};

type OpcionesFormulario<Valores, Respuesta> = Envio<Valores, Respuesta> & {
  valoresIniciales: Valores;
  esquema: ZodType;
};

type ApiDelEnvio<Valores> = {
  reset: () => void;
  setFieldMeta: (
    campo: DeepKeys<Valores>,
    actualizar: (metadatos: MetadatosDeCampo) => MetadatosDeCampo
  ) => void;
};

type MetadatosDeCampo = AnyFieldLikeMetaBase;

function esCampoDelFormulario<Valores extends object>(
  valores: Valores,
  nombre: string
): nombre is DeepKeys<Valores> {
  return Object.hasOwn(valores, nombre);
}

function marcarErroresDelServidor<Valores extends object>(
  valores: Valores,
  detalles: unknown,
  apiFormulario: ApiDelEnvio<Valores>
) {
  for (const { campo, mensaje } of detallesDelServidor(detalles)) {
    if (!esCampoDelFormulario(valores, campo)) continue;
    apiFormulario.setFieldMeta(campo, (metadatos) => ({
      ...metadatos,
      isTouched: true,
      errorMap: { ...metadatos.errorMap, onSubmit: { message: mensaje } },
    }));
  }
}

type EnvioDelFormulario<Valores> = {
  value: Valores;
  formApi: ApiDelEnvio<Valores>;
};

function crearManejadorDeEnvio<Valores extends object, Respuesta>({
  enviar,
  mensajeExito,
  alExito,
}: Envio<Valores, Respuesta>) {
  return async ({ value: valores, formApi }: EnvioDelFormulario<Valores>) => {
    const respuestaDelServidor = await enviar(valores);
    if (!respuestaDelServidor.ok) {
      aviso.error(respuestaDelServidor.error.message);
      const { details } = respuestaDelServidor.error;
      return marcarErroresDelServidor(valores, details, formApi);
    }
    if (mensajeExito) aviso.success(mensajeExito);
    alExito?.(respuestaDelServidor.data);
    formApi.reset();
  };
}

export function useFormulario<Valores extends object, Respuesta>({
  valoresIniciales,
  esquema,
  ...envio
}: OpcionesFormulario<Valores, Respuesta>) {
  return useFormularioDeLaApp({
    defaultValues: valoresIniciales,
    validators: { onSubmitAsync: validarConEsquema(esquema) },
    onSubmit: crearManejadorDeEnvio<Valores, Respuesta>(envio),
  });
}
