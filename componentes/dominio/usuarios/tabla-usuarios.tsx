import { EstadoVacio } from '@/componentes/comunes/estados';
import { InsigniaActivo } from '@/componentes/comunes/insignia-activo';
import { MarcoTabla } from '@/componentes/comunes/marco-tabla';
import { AccionesUsuario } from '@/componentes/dominio/usuarios/acciones-usuario';
import { InsigniaRol } from '@/componentes/dominio/usuarios/insignia-rol';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/componentes/ui/table';
import type { Usuario } from '@/servicios/usuarios';

function FilaUsuario({
  usuario,
  esUsuarioActual,
}: {
  usuario: Usuario;
  esUsuarioActual: boolean;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{usuario.nombre}</TableCell>
      <TableCell className="hidden text-muted-foreground sm:table-cell">
        {usuario.email}
      </TableCell>
      <TableCell>
        <InsigniaRol rol={usuario.rol} />
      </TableCell>
      <TableCell>
        <InsigniaActivo activo={usuario.activo} />
      </TableCell>
      <TableCell>
        <AccionesUsuario usuario={usuario} esUsuarioActual={esUsuarioActual} />
      </TableCell>
    </TableRow>
  );
}

export function TablaUsuarios({
  usuarios,
  usuarioActualId,
}: {
  usuarios: Usuario[];
  usuarioActualId: number;
}) {
  if (usuarios.length === 0) {
    return (
      <EstadoVacio mensaje="No hay usuarios que coincidan con la búsqueda." />
    );
  }
  return (
    <MarcoTabla>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead className="hidden sm:table-cell">Email</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usuarios.map((usuario) => (
          <FilaUsuario
            key={usuario.id}
            usuario={usuario}
            esUsuarioActual={usuario.id === usuarioActualId}
          />
        ))}
      </TableBody>
    </MarcoTabla>
  );
}
