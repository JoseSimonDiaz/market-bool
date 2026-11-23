import { Pila, Texto } from '@/componentes/primitivas';
import { SIN_REFERENCIA } from '@/constantes/interfaz';
import { formatearFechaHora } from '@/lib/formato';
import type { Factura } from '@/servicios/facturas';

type Anulacion = NonNullable<Factura['anulacion']>;

export function AvisoAnulacion({ anulacion }: { anulacion: Anulacion }) {
  const fecha = anulacion.fecha
    ? formatearFechaHora(anulacion.fecha)
    : SIN_REFERENCIA;
  const responsable = anulacion.usuario?.nombre ?? SIN_REFERENCIA;

  return (
    <div
      role="status"
      className="rounded-md border border-destructive/40 bg-destructive/5 p-3"
    >
      <Pila espacio={1}>
        <Texto tono="peligro" className="font-medium">
          Factura anulada el {fecha} por {responsable}
        </Texto>
        <Texto tono="suave">Motivo: {anulacion.motivo ?? SIN_REFERENCIA}</Texto>
      </Pila>
    </div>
  );
}
