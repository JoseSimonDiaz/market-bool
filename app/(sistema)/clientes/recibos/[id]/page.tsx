import { ArrowLeftIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { cargarOMostrarNoEncontrado } from '@/adaptadores/paginas';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { BotonEnlace } from '@/componentes/comunes/boton-enlace';
import { BotonImprimir } from '@/componentes/comunes/boton-imprimir';
import { ReciboDePago } from '@/componentes/dominio/clientes/recibo-de-pago';
import { Fila, Pila } from '@/componentes/primitivas';
import { CLASE_NO_IMPRIMIR } from '@/constantes/estilos';
import { RUTAS, type RUTAS_DE_ARCHIVO } from '@/constantes/rutas';
import { obtenerPago } from '@/servicios/pagos';

export const metadata: Metadata = { title: 'Recibo' };

export default async function PaginaRecibo({
  params,
}: PageProps<typeof RUTAS_DE_ARCHIVO.recibo>) {
  const usuario = await usuarioDePaginaOLogin();
  const { id } = await params;
  const recibo = await cargarOMostrarNoEncontrado(() =>
    obtenerPago(usuario, id)
  );

  return (
    <Pila espacio={6} className="mx-auto max-w-2xl">
      <Fila espacio={2} className={CLASE_NO_IMPRIMIR}>
        <BotonEnlace
          destino={RUTAS.cuentaCliente(recibo.cliente.id)}
          variant="outline"
        >
          <ArrowLeftIcon />
          Volver a la cuenta
        </BotonEnlace>
        <BotonImprimir />
      </Fila>
      <ReciboDePago recibo={recibo} />
    </Pila>
  );
}
