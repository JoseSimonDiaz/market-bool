import type { Metadata } from 'next';
import { redirect as redirigir } from 'next/navigation';
import { FormularioLogin } from '@/componentes/dominio/formulario-login';
import { Marca } from '@/componentes/estructura/marca';
import { Pila, Texto } from '@/componentes/primitivas';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/componentes/ui/card';
import { RUTAS } from '@/constantes/rutas';
import { obtenerUsuario } from '@/adaptadores/sesion';

export const metadata: Metadata = { title: 'Ingresar' };

export default async function PaginaLogin() {
  const yaInicioSesion = Boolean(await obtenerUsuario());
  if (yaInicioSesion) redirigir(RUTAS.inicio);

  return (
    <Pila className="min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Marca />
          <CardTitle>Ingresar</CardTitle>
          <CardDescription>
            Tienda de cartas Pokémon · sistema de gestión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormularioLogin />
        </CardContent>
      </Card>
      <Texto tamanio="chico" tono="suave">
        Solo personal autorizado.
      </Texto>
    </Pila>
  );
}
