import type { Metadata } from 'next';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { FormularioNuevaVenta } from '@/componentes/dominio/ventas/formulario-nueva-venta';
import { Pila } from '@/componentes/primitivas';
import { consultarProximoNumero } from '@/servicios/facturas';

export const metadata: Metadata = { title: 'Nueva venta' };

export default async function PaginaNuevaVenta() {
  const usuario = await usuarioDePaginaOLogin();
  const { numeroFormateado } = await consultarProximoNumero(usuario);
  const proximoNumero = `Próxima factura: ${numeroFormateado} (se confirma al emitir)`;

  return (
    <Pila espacio={6}>
      <EncabezadoPagina titulo="Nueva venta" descripcion={proximoNumero} />
      <FormularioNuevaVenta />
    </Pila>
  );
}
