'use client';

import { useCallback } from 'react';
import { accionEditarCliente } from '@/acciones/clientes';
import { BotonCambiarEstado } from '@/componentes/comunes/boton-cambiar-estado';
import { BotonEditarCliente } from '@/componentes/dominio/clientes/boton-editar-cliente';
import { BotonRegistrarPago } from '@/componentes/dominio/clientes/boton-registrar-pago';
import { TEXTOS_ESTADO_CLIENTE } from '@/constantes/etiquetas';
import type { Cliente } from '@/servicios/clientes';

export function AccionesCliente({ cliente }: { cliente: Cliente }) {
  const cambiarEstado = useCallback(
    (activar: boolean) => accionEditarCliente(cliente.id, { activo: activar }),
    [cliente.id]
  );
  const puedeRegistrarPago = cliente.cuentaCorriente && cliente.activo;

  return (
    <div className="flex flex-wrap gap-2">
      {puedeRegistrarPago && <BotonRegistrarPago cliente={cliente} />}
      <BotonEditarCliente cliente={cliente} />
      <BotonCambiarEstado
        activo={cliente.activo}
        textos={TEXTOS_ESTADO_CLIENTE}
        cambiarEstado={cambiarEstado}
      />
    </div>
  );
}
