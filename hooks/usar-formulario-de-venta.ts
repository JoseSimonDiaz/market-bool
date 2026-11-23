'use client';

import { llamarApi } from '@/adaptadores/cliente-api';
import { VENTA_NUEVA, type CamposVenta } from '@/constantes/formularios';
import { METODO_HTTP } from '@/constantes/http';
import { RUTAS_API } from '@/constantes/rutas';
import { esquemaFormularioVenta } from '@/esquemas/facturas';
import { useFormulario } from '@/hooks/usar-formulario';
import { armarPedidoDeVenta } from '@/lib/ventas';
import type { Factura } from '@/servicios/facturas';

function emitirFacturaDelFormulario(campos: CamposVenta) {
  return llamarApi<Factura>(
    RUTAS_API.facturas,
    METODO_HTTP.post,
    armarPedidoDeVenta(campos)
  );
}

export function useFormularioDeVenta(alEmitir: (factura: Factura) => void) {
  return useFormulario({
    valoresIniciales: VENTA_NUEVA,
    esquema: esquemaFormularioVenta,
    enviar: emitirFacturaDelFormulario,
    mensajeExito: 'Factura emitida.',
    alExito: alEmitir,
  });
}

export type FormularioDeVenta = ReturnType<typeof useFormularioDeVenta>;
