'use client';

import { BanIcon } from 'lucide-react';
import { BotonConIcono } from '@/componentes/comunes/boton-icono';
import { DialogoFormulario } from '@/componentes/comunes/dialogo-formulario';
import { FormularioAnulacion } from '@/componentes/dominio/ventas/formulario-anulacion';

export function BotonAnularFactura({ facturaId }: { facturaId: number }) {
  const disparador = (
    <BotonConIcono icono={BanIcon} etiqueta="Anular" variant="destructive" />
  );

  return (
    <DialogoFormulario
      titulo="Anular factura"
      descripcion="Reingresa el stock y, si fue a cuenta corriente, acredita el total. No se puede deshacer."
      disparador={disparador}
    >
      {(cerrar) => (
        <FormularioAnulacion facturaId={facturaId} alAnular={cerrar} />
      )}
    </DialogoFormulario>
  );
}
