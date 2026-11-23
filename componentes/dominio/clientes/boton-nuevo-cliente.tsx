'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { BotonNuevo } from '@/componentes/comunes/boton-nuevo';
import { DialogoFormulario } from '@/componentes/comunes/dialogo-formulario';
import { FormularioAltaCliente } from '@/componentes/dominio/clientes/formulario-alta-cliente';
import { RUTAS } from '@/constantes/rutas';
import type { Cliente } from '@/servicios/clientes';

export function BotonNuevoCliente() {
  const enrutador = useRouter();
  const abrirFicha = useCallback(
    (cliente: Cliente) => enrutador.push(RUTAS.cliente(cliente.id)),
    [enrutador]
  );

  return (
    <DialogoFormulario
      titulo="Nuevo cliente"
      descripcion="Persona o empresa identificada por DNI o CUIT."
      disparador={<BotonNuevo texto="Nuevo cliente" />}
    >
      {() => <FormularioAltaCliente alGuardar={abrirFicha} />}
    </DialogoFormulario>
  );
}
