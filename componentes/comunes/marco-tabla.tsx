import type { ReactNode } from 'react';
import { Table } from '@/componentes/ui/table';

export function MarcoTabla({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border">
      <Table>{children}</Table>
    </div>
  );
}
