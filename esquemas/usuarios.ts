import { z as zod } from 'zod';
import { MENSAJES_VALIDACION } from '@/constantes/mensajes';
import { LARGO_MAXIMO } from '@/constantes/validacion';
import {
  ESTADO_FILTRO,
  LONGITUD_MAXIMA_PASSWORD,
  LONGITUD_MINIMA_PASSWORD,
  ROLES,
  type Rol,
} from '@/constantes/dominio';
import {
  esquemaPaginacion,
  estadoFiltroConDefecto,
  textoObligatorio,
} from '@/esquemas/comunes';

export type UsuarioSesion = {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
};

const email = zod
  .string()
  .trim()
  .toLowerCase()
  .pipe(zod.email(MENSAJES_VALIDACION.emailInvalido));

const passwordNueva = zod
  .string()
  .min(
    LONGITUD_MINIMA_PASSWORD,
    MENSAJES_VALIDACION.minimoCaracteres(LONGITUD_MINIMA_PASSWORD)
  )
  .max(
    LONGITUD_MAXIMA_PASSWORD,
    MENSAJES_VALIDACION.maximoCaracteres(LONGITUD_MAXIMA_PASSWORD)
  );

const passwordIngresada = zod.string().min(1, MENSAJES_VALIDACION.obligatoria);

const rol = zod.enum(ROLES, MENSAJES_VALIDACION.elegirRol);

const nombre = textoObligatorio(LARGO_MAXIMO.nombreUsuario);

export const esquemaLogin = zod.strictObject({
  email,
  password: passwordIngresada,
});

export const esquemaCambioPassword = zod
  .strictObject({ actual: passwordIngresada, nueva: passwordNueva })
  .refine((passwords) => passwords.actual !== passwords.nueva, {
    path: ['nueva'],
    message: MENSAJES_VALIDACION.distintaDeLaActual,
  });

export const esquemaAltaUsuario = zod.strictObject({
  nombre,
  email,
  rol,
  password: passwordNueva,
});

export const esquemaEdicionUsuario = zod.strictObject({
  nombre: nombre.optional(),
  email: email.optional(),
  rol: rol.optional(),
  activo: zod.boolean().optional(),
});

export const esquemaFiltroUsuarios = esquemaPaginacion.extend({
  q: zod.string().trim().optional(),
  estado: estadoFiltroConDefecto(ESTADO_FILTRO.todos),
});

export type DatosLogin = zod.input<typeof esquemaLogin>;
export type DatosCambioPassword = zod.input<typeof esquemaCambioPassword>;
export type DatosAltaUsuario = zod.input<typeof esquemaAltaUsuario>;
export type DatosEdicionUsuario = zod.input<typeof esquemaEdicionUsuario>;
