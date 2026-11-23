import { CLASE_NO_IMPRIMIR } from '@/constantes/estilos';
import { combinarClases } from '@/lib/utils';
import { Marca } from '@/componentes/estructura/marca';
import { Navegacion } from '@/componentes/estructura/navegacion';

export function PanelLateral({ esAdmin }: { esAdmin: boolean }) {
  return (
    <aside
      className={combinarClases(
        CLASE_NO_IMPRIMIR,
        'sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-4 bg-sidebar p-3 text-sidebar-foreground md:flex'
      )}
    >
      <Marca />
      <Navegacion esAdmin={esAdmin} />
    </aside>
  );
}
