'use client';

import { useStore } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { SeccionComprador } from '@/componentes/dominio/ventas/seccion-comprador';
import { SeccionPago } from '@/componentes/dominio/ventas/seccion-pago';
import { SeccionRenglones } from '@/componentes/dominio/ventas/seccion-renglones';
import { FORMA_PAGO } from '@/constantes/dominio';
import { RUTAS } from '@/constantes/rutas';
import {
  useFormularioDeVenta,
  type FormularioDeVenta,
} from '@/hooks/usar-formulario-de-venta';
import {
  agregarAlPedido,
  calcularTotal,
  valorizarRenglones,
} from '@/lib/ventas';
import type { Cliente } from '@/servicios/clientes';
import type { Factura } from '@/servicios/facturas';
import type { Producto } from '@/servicios/productos';

function useComprador(formulario: FormularioDeVenta) {
  const [comprador, setComprador] = useState<Cliente | null>(null);
  const cambiarComprador = useCallback(
    (cliente: Cliente | null) => {
      setComprador(cliente);
      formulario.setFieldValue('clienteId', cliente ? cliente.id : null);
      const pagabaACuenta =
        formulario.state.values.forma === FORMA_PAGO.cuentaCorriente;
      if (pagabaACuenta && !cliente?.cuentaCorriente) {
        formulario.setFieldValue('forma', FORMA_PAGO.contado);
      }
    },
    [formulario]
  );
  return { comprador, cambiarComprador };
}

function useProductosDeLaVenta(formulario: FormularioDeVenta) {
  const [productos, setProductos] = useState<ReadonlyMap<number, Producto>>(
    () => new Map()
  );
  const agregarProducto = useCallback(
    (producto: Producto) => {
      setProductos((anteriores) =>
        new Map(anteriores).set(producto.id, producto)
      );
      formulario.setFieldValue(
        'items',
        agregarAlPedido(formulario.state.values.items, {
          productoId: producto.id,
          existencia: producto.existencia,
        })
      );
    },
    [formulario]
  );
  return { productos, agregarProducto };
}

export function FormularioNuevaVenta() {
  const enrutador = useRouter();
  const abrirComprobante = useCallback(
    (factura: Factura) => enrutador.push(RUTAS.venta(factura.id)),
    [enrutador]
  );
  const formulario = useFormularioDeVenta(abrirComprobante);
  const { comprador, cambiarComprador } = useComprador(formulario);
  const { productos, agregarProducto } = useProductosDeLaVenta(formulario);
  const renglones = useStore(formulario.store, (estado) => estado.values.items);
  const total = calcularTotal(valorizarRenglones(renglones, productos));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="flex min-w-0 flex-col gap-6">
        <SeccionComprador comprador={comprador} alCambiar={cambiarComprador} />
        <SeccionRenglones
          formulario={formulario}
          productos={productos}
          alElegirProducto={agregarProducto}
        />
      </div>
      <SeccionPago
        formulario={formulario}
        comprador={comprador}
        total={total}
      />
    </div>
  );
}
