'use client';

import type { ReactNode } from 'react';
import { Label } from '@/componentes/ui/label';
import { SEPARADOR_MENSAJES } from '@/constantes/interfaz';
import { useCampoActual, type ErrorDeCampo } from '@/hooks/formulario/contexto';

function useMensajeDeError() {
  const campo = useCampoActual<unknown>();
  const errores: ErrorDeCampo[] = campo.state.meta.errors;
  if (!campo.state.meta.isTouched) return '';
  return errores.map((error) => error.message).join(SEPARADOR_MENSAJES);
}

export function usePropsAccesiblesDelCampo() {
  const campo = useCampoActual<unknown>();
  const mensajeDeError = useMensajeDeError();
  const idDelError = `${campo.name}-error`;
  return {
    id: campo.name,
    name: campo.name,
    'aria-invalid': Boolean(mensajeDeError),
    'aria-describedby': mensajeDeError ? idDelError : undefined,
  };
}

export function MarcoCampo({
  etiqueta,
  ayuda,
  children,
}: {
  etiqueta: string;
  ayuda?: string;
  children: ReactNode;
}) {
  const campo = useCampoActual<unknown>();
  const mensajeDeError = useMensajeDeError();
  const mostrarAyuda = Boolean(ayuda) && !mensajeDeError;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={campo.name}>{etiqueta}</Label>
      {children}
      {mostrarAyuda && <p className="text-xs text-muted-foreground">{ayuda}</p>}
      <ErrorDelCampo />
    </div>
  );
}

export function ErrorDelCampo() {
  const campo = useCampoActual<unknown>();
  const mensajeDeError = useMensajeDeError();
  if (!mensajeDeError) return null;
  return (
    <p id={`${campo.name}-error`} className="text-xs text-destructive">
      {mensajeDeError}
    </p>
  );
}
