'use server';

import { redirect as redirigir } from 'next/navigation';
import { RUTAS } from '@/constantes/rutas';
import { ejecutarAccion } from '@/adaptadores/acciones';
import { cerrarSesion } from '@/adaptadores/sesion';
import { cambiarPassword } from '@/servicios/auth';

export async function accionCerrarSesion() {
  await cerrarSesion();
  redirigir(RUTAS.login);
}

export async function accionCambiarPassword(passwordsSinValidar: unknown) {
  return ejecutarAccion((usuarioActual) =>
    cambiarPassword(usuarioActual, passwordsSinValidar)
  );
}
