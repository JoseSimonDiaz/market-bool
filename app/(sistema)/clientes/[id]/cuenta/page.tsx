import type { Metadata } from 'next';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import { TablaCuentaCorriente } from '@/componentes/dominio/clientes/tabla-cuenta-corriente';
import type { RUTAS_DE_ARCHIVO } from '@/constantes/rutas';
import { consultarCuentaCorriente } from '@/servicios/cuenta-corriente';

export const metadata: Metadata = { title: 'Cuenta corriente' };

export default async function PaginaCuentaCorriente({
  params,
  searchParams,
}: PageProps<typeof RUTAS_DE_ARCHIVO.cuentaCliente>) {
  const usuario = await usuarioDePaginaOLogin();
  const { id } = await params;
  const cuenta = await consultarCuentaCorriente(
    usuario,
    id,
    await searchParams
  );

  return <TablaCuentaCorriente cuenta={cuenta} />;
}
