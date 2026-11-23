'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/componentes/ui/dialog';

export function DialogoPasswordTemporal({
  nombreUsuario,
  passwordTemporal,
  alCerrar,
}: {
  nombreUsuario: string;
  passwordTemporal: string;
  alCerrar: () => void;
}) {
  return (
    <Dialog open={Boolean(passwordTemporal)} onOpenChange={alCerrar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contraseña temporal</DialogTitle>
          <DialogDescription>
            Comunicásela a {nombreUsuario}. No se vuelve a mostrar.
          </DialogDescription>
        </DialogHeader>
        <p className="rounded-lg bg-muted p-3 text-center font-mono text-lg select-all">
          {passwordTemporal}
        </p>
      </DialogContent>
    </Dialog>
  );
}
