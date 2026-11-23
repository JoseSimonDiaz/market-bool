'use client';

import { BanknoteIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { BotonConIcono } from '@/componentes/comunes/boton-icono';
import { DialogoFormulario } from '@/componentes/comunes/dialogo-formulario';
import { FormularioPago } from '@/componentes/dominio/clientes/formulario-pago';
import { RUTAS } from '@/constantes/rutas';
import { formatearMoneda } from '@/lib/formato';
import type { Cliente } from '@/servicios/clientes';
import type { Recibo } from '@/servicios/pagos';

export function BotonRegistrarPago({ cliente }: { cliente: Cliente }) {
  const enrutador = useRouter();
  const abrirRecibo = useCallback(
    (recibo: Recibo) => enrutador.push(RUTAS.recibo(recibo.id)),
    [enrutador]
  );
  const saldoActual = `Saldo actual: ${formatearMoneda(cliente.saldo)}`;
  const disparador = (
    <BotonConIcono
      icono={BanknoteIcon}
      etiqueta="Registrar pago"
      variant="default"
    />
  );

  return (
    <DialogoFormulario
      titulo="Registrar pago"
      descripcion={saldoActual}
      disparador={disparador}
    >
      {() => <FormularioPago clienteId={cliente.id} alGuardar={abrirRecibo} />}
    </DialogoFormulario>
  );
}
