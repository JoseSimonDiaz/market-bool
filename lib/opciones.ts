export type Opcion<Valor extends string | number = string> = {
  valor: Valor;
  etiqueta: string;
};

export function aOpcionesDeSelect(opciones: Opcion<string | number>[]) {
  return opciones.map((opcion) => ({
    value: String(opcion.valor),
    label: opcion.etiqueta,
  }));
}

export function aOpcionesEtiquetadas<Valor extends string>(
  valores: readonly Valor[],
  etiquetas: Record<Valor, string>
): Opcion<Valor>[] {
  return valores.map((valorDeLaOpcion) => ({
    valor: valorDeLaOpcion,
    etiqueta: etiquetas[valorDeLaOpcion],
  }));
}

export function aOpcionesTextuales(textos: readonly string[]): Opcion[] {
  return textos.map((texto) => ({ valor: texto, etiqueta: texto }));
}
