import { MarcoSistema } from '@/componentes/estructura/marco-sistema';
import { usuarioDePaginaOLogin } from '@/adaptadores/sesion';
import type { RUTAS } from '@/constantes/rutas';

export default async function LayoutSistema({
  children,
}: LayoutProps<typeof RUTAS.inicio>) {
  const usuario = await usuarioDePaginaOLogin();
  return <MarcoSistema usuario={usuario}>{children}</MarcoSistema>;
}
