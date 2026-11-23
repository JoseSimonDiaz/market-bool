'use client';

import { useCallback, useState, useTransition } from 'react';
import { toast as aviso } from 'sonner';
import type { ResultadoAccion } from '@/adaptadores/acciones';

type Confirmacion<Respuesta> = {
  ejecutar: () => Promise<ResultadoAccion<Respuesta>>;
  mensajeExito: string;
  alConfirmar?: (respuesta: Respuesta) => void;
};

async function ejecutarConAviso<Respuesta>(
  { ejecutar, mensajeExito, alConfirmar }: Confirmacion<Respuesta>,
  cerrar: () => void
) {
  const respuestaDeLaAccion = await ejecutar();
  if (!respuestaDeLaAccion.ok) {
    aviso.error(respuestaDeLaAccion.error.message);
    return;
  }
  aviso.success(mensajeExito);
  cerrar();
  alConfirmar?.(respuestaDeLaAccion.data);
}

export function useConfirmacion<Respuesta>(
  confirmacion: Confirmacion<Respuesta>
) {
  const [abierto, setAbierto] = useState(false);
  const [ejecutando, iniciarTransicion] = useTransition();
  const cerrar = useCallback(() => setAbierto(false), []);
  const confirmar = useCallback(
    () => iniciarTransicion(() => ejecutarConAviso(confirmacion, cerrar)),
    [confirmacion, cerrar]
  );
  return { abierto, setAbierto, ejecutando, confirmar };
}
