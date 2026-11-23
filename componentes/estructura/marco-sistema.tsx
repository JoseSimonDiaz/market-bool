import type { ReactNode } from 'react';
import { BarraSuperior } from '@/componentes/estructura/barra-superior';
import { PanelLateral } from '@/componentes/estructura/panel-lateral';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { esAdmin } from '@/servicios/permisos';

export function MarcoSistema({
  usuario,
  children,
}: {
  usuario: UsuarioSesion;
  children: ReactNode;
}) {
  const usuarioEsAdmin = esAdmin(usuario);

  return (
    <div className="flex min-h-screen">
      <PanelLateral esAdmin={usuarioEsAdmin} />
      <div className="flex min-w-0 flex-1 flex-col">
        <BarraSuperior usuario={usuario} esAdmin={usuarioEsAdmin} />
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
