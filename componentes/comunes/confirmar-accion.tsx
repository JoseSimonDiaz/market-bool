'use client';

import type { ReactElement } from 'react';
import type { ResultadoAccion } from '@/adaptadores/acciones';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/componentes/ui/alert-dialog';
import {
  VARIANTE_CONFIRMACION,
  type GravedadAccion,
} from '@/constantes/interfaz';
import { useConfirmacion } from '@/hooks/usar-confirmacion';

export type TextosConfirmacion = {
  titulo: string;
  descripcion: string;
  accion: string;
  mensajeExito: string;
};

type PropsConfirmarAccion<Respuesta> = {
  disparador: ReactElement;
  textos: TextosConfirmacion;
  gravedad: GravedadAccion;
  ejecutar: () => Promise<ResultadoAccion<Respuesta>>;
  alConfirmar?: (respuesta: Respuesta) => void;
};

export function ConfirmarAccion<Respuesta>({
  disparador,
  textos,
  gravedad,
  ...confirmacion
}: PropsConfirmarAccion<Respuesta>) {
  const { abierto, setAbierto, ejecutando, confirmar } = useConfirmacion({
    ...confirmacion,
    mensajeExito: textos.mensajeExito,
  });

  return (
    <AlertDialog open={abierto} onOpenChange={setAbierto}>
      <AlertDialogTrigger render={disparador} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{textos.titulo}</AlertDialogTitle>
          <AlertDialogDescription>{textos.descripcion}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={ejecutando}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant={VARIANTE_CONFIRMACION[gravedad]}
            disabled={ejecutando}
            onClick={confirmar}
          >
            {textos.accion}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
