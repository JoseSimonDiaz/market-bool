'use client';

import { accionCrearCliente } from '@/acciones/clientes';
import { CamposCliente } from '@/componentes/dominio/clientes/campos-cliente';
import {
  CAMPOS_COMUNES_CLIENTE,
  CLIENTE_NUEVO,
} from '@/constantes/formularios';
import { esquemaAltaCliente } from '@/esquemas/clientes';
import { useFormulario } from '@/hooks/usar-formulario';
import type { Cliente } from '@/servicios/clientes';

export function FormularioAltaCliente({
  alGuardar,
}: {
  alGuardar: (cliente: Cliente) => void;
}) {
  const formulario = useFormulario({
    valoresIniciales: CLIENTE_NUEVO,
    esquema: esquemaAltaCliente,
    enviar: accionCrearCliente,
    mensajeExito: 'Cliente creado.',
    alExito: alGuardar,
  });

  return (
    <formulario.AppForm>
      <formulario.Formulario>
        <CamposCliente form={formulario} fields={CAMPOS_COMUNES_CLIENTE} />
        <formulario.BotonEnviar>Crear cliente</formulario.BotonEnviar>
      </formulario.Formulario>
    </formulario.AppForm>
  );
}
