import { DatoFicha } from '@/componentes/comunes/dato-ficha';
import { Grilla, Pila, Texto, Titulo } from '@/componentes/primitivas';
import { Card, CardContent } from '@/componentes/ui/card';
import { Separator } from '@/componentes/ui/separator';
import { EncabezadoDelComercio } from '@/componentes/dominio/encabezado-del-comercio';
import { ETIQUETA_MEDIO_PAGO } from '@/constantes/etiquetas';
import { SIN_REFERENCIA } from '@/constantes/interfaz';
import { formatearFechaHora, formatearMoneda } from '@/lib/formato';
import type { Recibo } from '@/servicios/pagos';

export function ReciboDePago({ recibo }: { recibo: Recibo }) {
  return (
    <Card>
      <CardContent>
        <Pila espacio={6}>
          <EncabezadoDelComercio />
          <Separator />
          <Titulo nivel={2}>Recibo {recibo.numeroRecibo}</Titulo>
          <Grilla columnas={2}>
            <DatoFicha etiqueta="Fecha">
              {formatearFechaHora(recibo.fecha)}
            </DatoFicha>
            <DatoFicha etiqueta="Cliente">{recibo.cliente.nombre}</DatoFicha>
            <DatoFicha etiqueta="Importe">
              {formatearMoneda(recibo.importe)}
            </DatoFicha>
            <DatoFicha etiqueta="Medio de pago">
              {ETIQUETA_MEDIO_PAGO[recibo.medio]}
            </DatoFicha>
            <DatoFicha etiqueta="Saldo restante">
              {formatearMoneda(recibo.saldoCliente)}
            </DatoFicha>
            <DatoFicha etiqueta="Atendió">{recibo.usuario.nombre}</DatoFicha>
          </Grilla>
          <Texto tono="suave">
            Observación: {recibo.observacion ?? SIN_REFERENCIA}
          </Texto>
        </Pila>
      </CardContent>
    </Card>
  );
}
