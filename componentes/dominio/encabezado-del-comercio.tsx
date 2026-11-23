import { Pila, Texto, Titulo } from '@/componentes/primitivas';
import { DATOS_DEL_COMERCIO } from '@/constantes/comercio';

export function EncabezadoDelComercio() {
  return (
    <Pila espacio={1}>
      <Titulo nivel={2}>{DATOS_DEL_COMERCIO.nombre}</Titulo>
      <Texto tono="suave">{DATOS_DEL_COMERCIO.rubro}</Texto>
      <Texto tono="suave" tamanio="chico">
        {DATOS_DEL_COMERCIO.domicilio} · Tel. {DATOS_DEL_COMERCIO.telefono} ·
        CUIT {DATOS_DEL_COMERCIO.cuit}
      </Texto>
    </Pila>
  );
}
