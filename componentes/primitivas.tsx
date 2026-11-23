import type { ReactNode } from 'react';
import {
  COLUMNAS,
  ESPACIOS,
  TAMANIOS_TEXTO,
  TITULOS,
  TONOS,
} from '@/constantes/estilos';
import { combinarClases } from '@/lib/utils';

type ConHijos = { children?: ReactNode; className?: string };

type Espacio = keyof typeof ESPACIOS;

export function Pila({
  children,
  className,
  espacio = 4,
}: ConHijos & { espacio?: Espacio }) {
  return (
    <div
      className={combinarClases('flex flex-col', ESPACIOS[espacio], className)}
    >
      {children}
    </div>
  );
}

export function Fila({
  children,
  className,
  espacio = 2,
}: ConHijos & { espacio?: Espacio }) {
  return (
    <div
      className={combinarClases(
        'flex flex-wrap items-center',
        ESPACIOS[espacio],
        className
      )}
    >
      {children}
    </div>
  );
}

export function Grilla({
  children,
  className,
  columnas = 2,
}: ConHijos & { columnas?: keyof typeof COLUMNAS }) {
  return (
    <div
      className={combinarClases(
        'grid grid-cols-1 gap-4',
        COLUMNAS[columnas],
        className
      )}
    >
      {children}
    </div>
  );
}

export function Texto({
  children,
  className,
  tono = 'normal',
  tamanio = 'normal',
}: ConHijos & {
  tono?: keyof typeof TONOS;
  tamanio?: keyof typeof TAMANIOS_TEXTO;
}) {
  return (
    <p
      className={combinarClases(
        TAMANIOS_TEXTO[tamanio],
        TONOS[tono],
        className
      )}
    >
      {children}
    </p>
  );
}

export function Titulo({
  children,
  className,
  nivel = 1,
}: ConHijos & { nivel?: keyof typeof TITULOS }) {
  const { Etiqueta, clases } = TITULOS[nivel];
  return (
    <Etiqueta className={combinarClases(clases, className)}>
      {children}
    </Etiqueta>
  );
}
