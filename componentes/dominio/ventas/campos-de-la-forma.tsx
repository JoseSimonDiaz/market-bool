'use client';

import { AvisoCuentaCorriente } from '@/componentes/dominio/ventas/aviso-cuenta-corriente';
import { CamposContado } from '@/componentes/dominio/ventas/campos-contado';
import { CamposTarjeta } from '@/componentes/dominio/ventas/campos-tarjeta';
import { FORMA_PAGO, type FormaPago } from '@/constantes/dominio';
import type { FormularioDeVenta } from '@/hooks/usar-formulario-de-venta';
import type { Cliente } from '@/servicios/clientes';

export function CamposDeLaForma({
  forma,
  formulario,
  comprador,
  total,
}: {
  forma: FormaPago;
  formulario: FormularioDeVenta;
  comprador: Cliente | null;
  total: number;
}) {
  if (forma === FORMA_PAGO.contado) {
    return <CamposContado formulario={formulario} total={total} />;
  }
  if (forma === FORMA_PAGO.tarjeta) {
    return <CamposTarjeta formulario={formulario} />;
  }
  return <AvisoCuentaCorriente comprador={comprador} />;
}
