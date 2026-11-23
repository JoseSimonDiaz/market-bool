import { ArrowLeftIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { cargarOMostrarNoEncontrado } from '@/adaptadores/paginas';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { BotonEnlace } from '@/componentes/comunes/boton-enlace';
import { BotonImprimir } from '@/componentes/comunes/boton-imprimir';
import { BotonAnularFactura } from '@/componentes/dominio/ventas/boton-anular-factura';
import { ComprobanteFactura } from '@/componentes/dominio/ventas/comprobante-factura';
import { Fila, Pila } from '@/componentes/primitivas';
import { ESTADO_FACTURA } from '@/constantes/dominio';
import { CLASE_NO_IMPRIMIR } from '@/constantes/estilos';
import { RUTAS, type RUTAS_DE_ARCHIVO } from '@/constantes/rutas';
import { obtenerFactura } from '@/servicios/facturas';
import { esAdmin } from '@/servicios/permisos';

export const metadata: Metadata = { title: 'Factura' };

export default async function PaginaFactura({
  params,
}: PageProps<typeof RUTAS_DE_ARCHIVO.venta>) {
  const usuario = await usuarioDePaginaOLogin();
  const { id } = await params;
  const factura = await cargarOMostrarNoEncontrado(() =>
    obtenerFactura(usuario, id)
  );
  const sePuedeAnular =
    esAdmin(usuario) && factura.estado === ESTADO_FACTURA.emitida;

  return (
    <Pila espacio={6} className="mx-auto w-full max-w-3xl">
      <Fila espacio={2} className={CLASE_NO_IMPRIMIR}>
        <BotonEnlace destino={RUTAS.ventas} variant="outline">
          <ArrowLeftIcon />
          Volver a ventas
        </BotonEnlace>
        <BotonImprimir />
        {sePuedeAnular && <BotonAnularFactura facturaId={factura.id} />}
      </Fila>
      <ComprobanteFactura factura={factura} />
    </Pila>
  );
}
