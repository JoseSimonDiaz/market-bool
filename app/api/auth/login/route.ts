import { rutaPublica } from '@/adaptadores/rutas';
import { abrirSesion } from '@/adaptadores/sesion';
import { iniciarSesion } from '@/servicios/auth';

export const POST = rutaPublica(async ({ cuerpo }) => {
  const usuarioAutenticado = await iniciarSesion(cuerpo);
  await abrirSesion(usuarioAutenticado);
  return usuarioAutenticado;
});
