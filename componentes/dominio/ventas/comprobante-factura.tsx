import { DatoFicha } from '@/componentes/comunes/dato-ficha';
import { EncabezadoDelComercio } from '@/componentes/dominio/encabezado-del-comercio';
import { AvisoAnulacion } from '@/componentes/dominio/ventas/aviso-anulacion';
import { DescripcionDelPago } from '@/componentes/dominio/ventas/descripcion-del-pago';
import { TablaDetalleFactura } from '@/componentes/dominio/ventas/tabla-detalle-factura';
import { Grilla, Pila, Texto, Titulo } from '@/componentes/primitivas';
import { Card, CardContent } from '@/componentes/ui/card';
import { Separator } from '@/componentes/ui/separator';
import { TEXTO_CONSUMIDOR_FINAL } from '@/constantes/etiquetas';
import { SEPARADOR_DATOS } from '@/constantes/interfaz';
import { formatearFechaHora } from '@/lib/formato';
import type { Factura } from '@/servicios/facturas';

function datosDelComprador({ cliente }: Factura) {
  if (!cliente) return TEXTO_CONSUMIDOR_FINAL;
  return [
    cliente.nombre,
    `${cliente.tipoDoc} ${cliente.nroDoc}`,
    cliente.domicilio,
  ]
    .filter(Boolean)
    .join(SEPARADOR_DATOS);
}

export function ComprobanteFactura({ factura }: { factura: Factura }) {
  return (
    <Card>
      <CardContent>
        <Pila espacio={6}>
          <EncabezadoDelComercio />
          <Separator />
          <Titulo nivel={2}>Factura {factura.numeroFormateado}</Titulo>
          {factura.anulacion && (
            <AvisoAnulacion anulacion={factura.anulacion} />
          )}
          <Grilla columnas={2}>
            <DatoFicha etiqueta="Fecha y hora">
              {formatearFechaHora(factura.fecha)}
            </DatoFicha>
            <DatoFicha etiqueta="Vendedor">{factura.vendedor.nombre}</DatoFicha>
          </Grilla>
          <Pila espacio={1}>
            <Texto tono="suave" tamanio="chico">
              Comprador
            </Texto>
            <Texto>{datosDelComprador(factura)}</Texto>
          </Pila>
          <TablaDetalleFactura factura={factura} />
          <Texto>
            <DescripcionDelPago factura={factura} />
          </Texto>
        </Pila>
      </CardContent>
    </Card>
  );
}
