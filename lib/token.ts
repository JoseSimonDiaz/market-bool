import { jwtVerify as verificarFirmaJwt, SignJWT as FirmadorJwt } from 'jose';
import { z as zod } from 'zod';
import { obtenerSecretoDeSesion } from '@/constantes/config';
import { ROLES, type Rol } from '@/constantes/dominio';
import {
  ALGORITMO_FIRMA_SESION,
  DURACION_SESION_SEGUNDOS,
} from '@/constantes/seguridad';

export type SesionDelToken = { usuarioId: number; rol: Rol };

function claveDeFirma() {
  return new TextEncoder().encode(obtenerSecretoDeSesion());
}

const esquemaContenidoDelToken = zod.object({
  sub: zod.coerce.number().int().positive(),
  rol: zod.enum(ROLES),
});

export function firmarToken({ usuarioId, rol }: SesionDelToken) {
  return new FirmadorJwt({ rol })
    .setProtectedHeader({ alg: ALGORITMO_FIRMA_SESION })
    .setSubject(String(usuarioId))
    .setIssuedAt()
    .setExpirationTime(`${DURACION_SESION_SEGUNDOS}s`)
    .sign(claveDeFirma());
}

async function verificarToken(token: string) {
  try {
    const { payload } = await verificarFirmaJwt(token, claveDeFirma(), {
      algorithms: [ALGORITMO_FIRMA_SESION],
    });
    return payload;
  } catch (_tokenInvalidoOVencido) {
    return null;
  }
}

export async function leerSesionDelToken(
  token: string | undefined
): Promise<SesionDelToken | null> {
  if (!token) return null;
  const contenidoVerificado = await verificarToken(token);
  const contenidoValidado =
    esquemaContenidoDelToken.safeParse(contenidoVerificado);
  if (!contenidoValidado.success) return null;
  const { sub: usuarioId, rol } = contenidoValidado.data;
  return { usuarioId, rol };
}
