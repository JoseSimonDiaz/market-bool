import { sql as expresionSql } from 'drizzle-orm';
import type { Transaccion } from '@/basedatos/conexion';
import { numeradores } from '@/basedatos/esquema';
import { INCREMENTO_NUMERADOR, PRIMER_NUMERO } from '@/constantes/dominio';

// Numeración correlativa y sin huecos: el número se toma dentro de la transacción que confirma.
export async function tomarSiguienteNumero(
  transaccion: Transaccion,
  clave: string
) {
  const [numerador] = await transaccion
    .insert(numeradores)
    .values({ clave, ultimo: PRIMER_NUMERO })
    .onConflictDoUpdate({
      target: numeradores.clave,
      set: {
        ultimo: expresionSql`${numeradores.ultimo} + ${INCREMENTO_NUMERADOR}`,
      },
    })
    .returning({ ultimo: numeradores.ultimo });
  return numerador.ultimo;
}
