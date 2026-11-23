import { CLASE_NO_IMPRIMIR } from '@/constantes/estilos';
import { combinarClases } from '@/lib/utils';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { accionCerrarSesion } from '@/acciones/auth';
import { BotonEnlace } from '@/componentes/comunes/boton-enlace';
import { MenuMovil } from '@/componentes/estructura/menu-movil';
import { InsigniaRol } from '@/componentes/dominio/usuarios/insignia-rol';
import { Button } from '@/componentes/ui/button';
import { RUTAS } from '@/constantes/rutas';
import type { UsuarioSesion } from '@/esquemas/usuarios';

export function BarraSuperior({
  usuario,
  esAdmin,
}: {
  usuario: UsuarioSesion;
  esAdmin: boolean;
}) {
  return (
    <header
      className={combinarClases(
        CLASE_NO_IMPRIMIR,
        'sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur'
      )}
    >
      <MenuMovil esAdmin={esAdmin} />
      <div className="ml-auto flex items-center gap-2">
        <BotonEnlace destino={RUTAS.perfil} variant="ghost" size="sm">
          <UserIcon />
          <span className="max-w-40 truncate">{usuario.nombre}</span>
        </BotonEnlace>
        <InsigniaRol rol={usuario.rol} />
        <form action={accionCerrarSesion}>
          <Button variant="outline" size="sm" type="submit">
            <LogOutIcon />
            Salir
          </Button>
        </form>
      </div>
    </header>
  );
}
