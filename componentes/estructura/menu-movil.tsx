'use client';

import { MenuIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Marca } from '@/componentes/estructura/marca';
import { Navegacion } from '@/componentes/estructura/navegacion';
import { Button } from '@/componentes/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/componentes/ui/sheet';

export function MenuMovil({ esAdmin }: { esAdmin: boolean }) {
  const [abierto, setAbierto] = useState(false);
  const cerrar = useCallback(() => setAbierto(false), []);

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menú"
          />
        }
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-64 bg-sidebar p-3 text-sidebar-foreground"
      >
        <SheetTitle className="sr-only">Menú</SheetTitle>
        <Marca />
        <Navegacion esAdmin={esAdmin} alNavegar={cerrar} />
      </SheetContent>
    </Sheet>
  );
}
