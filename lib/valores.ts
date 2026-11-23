export function tieneValor<Valor>(valor: Valor | null): valor is Valor {
  return valor !== null;
}
