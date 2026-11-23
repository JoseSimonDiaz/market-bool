import type { ReactNode } from 'react';

export function DatoFicha({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: ReactNode;
}) {
  return (
    <dl className="flex flex-col gap-1">
      <dt className="text-xs text-muted-foreground">{etiqueta}</dt>
      <dd className="text-lg font-semibold tabular-nums">{children}</dd>
    </dl>
  );
}
