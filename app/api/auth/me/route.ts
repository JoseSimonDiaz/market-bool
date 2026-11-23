import { ruta } from '@/adaptadores/rutas';

export const GET = ruta(async ({ usuarioActual }) => usuarioActual);
