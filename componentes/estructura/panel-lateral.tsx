import { Marca } from '@/componentes/estructura/marca';
import { Navegacion } from '@/componentes/estructura/navegacion';

export function PanelLateral({ esAdmin }: { esAdmin: boolean }) {
  return (
    <aside className="no-imprimir sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-4 bg-sidebar p-3 text-sidebar-foreground md:flex">
      <Marca />
      <Navegacion esAdmin={esAdmin} />
    </aside>
  );
}
