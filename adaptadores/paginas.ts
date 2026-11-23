import { notFound as mostrarNoEncontrado } from 'next/navigation';
import { ZodError } from 'zod';
import { esErrorNoEncontrado } from '@/servicios/errores';

export async function cargarOMostrarNoEncontrado<Recurso>(
  cargar: () => Promise<Recurso>
) {
  try {
    return await cargar();
  } catch (error) {
    const idInvalidoOInexistente =
      esErrorNoEncontrado(error) || error instanceof ZodError;
    if (idInvalidoOInexistente) mostrarNoEncontrado();
    throw error;
  }
}
