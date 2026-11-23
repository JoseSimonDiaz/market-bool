'use client';

import { useEffect, useState } from 'react';
import type { Paginado } from '@/basedatos/consultas';
import { llamarApi } from '@/adaptadores/cliente-api';
import { METODO_HTTP } from '@/constantes/http';
import { PARAMETRO_URL, RESULTADOS_BUSQUEDA_EN_VIVO } from '@/constantes/url';
import { useValorDemorado } from '@/hooks/usar-valor-demorado';

function rutaDeBusqueda(rutaApi: string, textoBuscado: string) {
  const parametros = new URLSearchParams({
    [PARAMETRO_URL.busqueda]: textoBuscado,
    [PARAMETRO_URL.tamanioPagina]: String(RESULTADOS_BUSQUEDA_EN_VIVO),
  });
  return `${rutaApi}?${parametros}`;
}

type ResultadosDeUnaBusqueda<Resultado> = {
  textoBuscado: string;
  resultados: Resultado[];
};

export function useBusquedaEnVivo<Resultado>(
  rutaApi: string,
  textoBuscado: string
) {
  const textoDemorado = useValorDemorado(textoBuscado.trim());
  const [ultimaBusqueda, setUltimaBusqueda] = useState<
    ResultadosDeUnaBusqueda<Resultado>
  >({ textoBuscado: '', resultados: [] });

  useEffect(() => {
    if (!textoDemorado) return;
    let vigente = true;
    llamarApi<Paginado<Resultado>>(
      rutaDeBusqueda(rutaApi, textoDemorado),
      METODO_HTTP.get
    ).then((respuesta) => {
      if (!vigente || !respuesta.ok) return;
      setUltimaBusqueda({
        textoBuscado: textoDemorado,
        resultados: respuesta.data.data,
      });
    });
    return () => {
      vigente = false;
    };
  }, [rutaApi, textoDemorado]);

  const correspondeAlTexto = ultimaBusqueda.textoBuscado === textoDemorado;
  return correspondeAlTexto && textoDemorado ? ultimaBusqueda.resultados : [];
}
