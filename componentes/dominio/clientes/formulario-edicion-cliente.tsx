'use client';

import { useCallback } from 'react';
import { accionEditarCliente } from '@/acciones/clientes';
import { CamposCliente } from '@/componentes/dominio/clientes/campos-cliente';
import {
  CAMPOS_COMUNES_CLIENTE,
  type CamposComunesCliente,
} from '@/constantes/formularios';
import { esquemaEdicionCliente } from '@/esquemas/clientes';
import { useFormulario } from '@/hooks/usar-formulario';
import type { Cliente } from '@/servicios/clientes';

function datosEditables(cliente: Cliente): CamposComunesCliente {
  return {
    tipoDoc: cliente.tipoDoc,
    nroDoc: cliente.nroDoc,
    nombre: cliente.nombre,
    domicilio: cliente.domicilio ?? '',
    telefono: cliente.telefono ?? '',
    email: cliente.email ?? '',
    cuentaCorriente: cliente.cuentaCorriente,
    limiteCredito: cliente.limiteCredito,
  };
}

export function FormularioEdicionCliente({
  cliente,
  alGuardar,
}: {
  cliente: Cliente;
  alGuardar: () => void;
}) {
  const guardarCambios = useCallback(
    (cambios: CamposComunesCliente) => accionEditarCliente(cliente.id, cambios),
    [cliente.id]
  );
  const formulario = useFormulario({
    valoresIniciales: datosEditables(cliente),
    esquema: esquemaEdicionCliente,
    enviar: guardarCambios,
    mensajeExito: 'Cliente actualizado.',
    alExito: alGuardar,
  });

  return (
    <formulario.AppForm>
      <formulario.Formulario>
        <CamposCliente form={formulario} fields={CAMPOS_COMUNES_CLIENTE} />
        <formulario.BotonEnviar>Guardar cambios</formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
