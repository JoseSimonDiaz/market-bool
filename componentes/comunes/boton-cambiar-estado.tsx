'use client';

import { PowerIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, type ReactElement } from 'react';
import { ConfirmarAccion } from '@/componentes/comunes/confirmar-accion';
import { Button } from '@/componentes/ui/button';
import type { TextosCambioEstadoEntidad } from '@/constantes/etiquetas';
import { PRESENTACION_SEGUN_ESTADO } from '@/constantes/interfaz';
import type { ResultadoAccion } from '@/adaptadores/acciones';

type PropsCambioDeEstado<Respuesta> = {
  activo: boolean;
  textos: TextosCambioEstadoEntidad;
  cambiarEstado: (activar: boolean) => Promise<ResultadoAccion<Respuesta>>;
};

function usePresentacionDelCambio({
  activo,
  textos,
}: Pick<PropsCambioDeEstado<unknown>, 'activo' | 'textos'>) {
  if (activo) {
    return { textos: textos.desactivar, ...PRESENTACION_SEGUN_ESTADO.activo };
  }
  return { textos: textos.activar, ...PRESENTACION_SEGUN_ESTADO.inactivo };
}

function ConfirmarCambioDeEstado<Respuesta>({
  activo,
  textos,
  cambiarEstado,
  disparador,
}: PropsCambioDeEstado<Respuesta> & { disparador: ReactElement }) {
  const enrutador = useRouter();
  const presentacion = usePresentacionDelCambio({ activo, textos });
  const ejecutar = useCallback(
    () => cambiarEstado(!activo),
    [cambiarEstado, activo]
  );
  const refrescar = useCallback(() => enrutador.refresh(), [enrutador]);

  return (
    <ConfirmarAccion
      disparador={disparador}
      textos={presentacion.textos}
      gravedad={presentacion.gravedad}
      ejecutar={ejecutar}
      alConfirmar={refrescar}
    />
  );
}

export function BotonCambiarEstado<Respuesta>(
  props: PropsCambioDeEstado<Respuesta>
) {
  const presentacion = usePresentacionDelCambio(props);
  const disparador = (
    <Button variant={presentacion.variante}>
      <PowerIcon />
      {presentacion.textos.accion}
    </Button>
  );
  return <ConfirmarCambioDeEstado {...props} disparador={disparador} />;
}

export function BotonIconoCambiarEstado<Respuesta>(
  props: PropsCambioDeEstado<Respuesta>
) {
  const presentacion = usePresentacionDelCambio(props);
  const disparador = (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={presentacion.textos.accion}
    >
      <PowerIcon />
    </Button>
  );
  return <ConfirmarCambioDeEstado {...props} disparador={disparador} />;
}
