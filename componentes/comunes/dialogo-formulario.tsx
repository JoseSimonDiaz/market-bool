'use client';

import {
  useCallback,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/componentes/ui/dialog';

export function DialogoFormulario({
  disparador,
  titulo,
  descripcion,
  children,
}: {
  disparador: ReactElement;
  titulo: string;
  descripcion?: string;
  children: (cerrar: () => void) => ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);
  const cerrar = useCallback(() => setAbierto(false), []);

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={disparador} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          {descripcion && <DialogDescription>{descripcion}</DialogDescription>}
        </DialogHeader>
        {abierto && children(cerrar)}
      </DialogContent>
    </Dialog>
  );
}
