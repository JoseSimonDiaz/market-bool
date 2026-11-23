'use client';

import { UserPlusIcon } from 'lucide-react';
import { BotonConIcono } from '@/componentes/comunes/boton-icono';
import { DialogoFormulario } from '@/componentes/comunes/dialogo-formulario';
import { FormularioAltaCliente } from '@/componentes/dominio/clientes/formulario-alta-cliente';
import type { Cliente } from '@/servicios/clientes';

export function BotonAltaRapidaCliente({
  alCrear,
}: {
  alCrear: (cliente: Cliente) => void;
}) {
  return (
    <DialogoFormulario
      titulo="Nuevo cliente"
      descripcion="Se agrega como comprador sin perder la venta en curso."
      disparador={
        <BotonConIcono icono={UserPlusIcon} etiqueta="Nuevo cliente" />
      }
    >
      {() => <FormularioAltaCliente alGuardar={alCrear} />}
    </DialogoFormulario>
  );
}
