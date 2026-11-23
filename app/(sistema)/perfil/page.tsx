import type { Metadata } from 'next';
import { EncabezadoPagina } from '@/componentes/comunes/encabezado-pagina';
import { FormularioPassword } from '@/componentes/dominio/formulario-password';
import { Pila } from '@/componentes/primitivas';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/componentes/ui/card';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';

export const metadata: Metadata = { title: 'Mi perfil' };

export default async function PaginaPerfil() {
  const usuario = await usuarioDePaginaOLogin();

  return (
    <Pila espacio={6}>
      <EncabezadoPagina
        titulo="Mi perfil"
        descripcion={`${usuario.nombre} · ${usuario.email}`}
      />
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Cambiar contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <FormularioPassword />
        </CardContent>
      </Card>
    </Pila>
  );
}
