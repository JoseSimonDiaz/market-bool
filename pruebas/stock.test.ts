import { eq as esIgualA } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { ZodError } from 'zod';
import { beforeAll, describe, expect, it as caso } from 'vitest';
import { baseDeDatos } from '@/basedatos/conexion';
import { productos, usuarios } from '@/basedatos/esquema';
import { sembrar, verificarInvariantes } from '@/scripts/semilla';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { buscarUsuarioActivo } from '@/servicios/auth';
import { ApiError } from '@/servicios/errores';
import { editarProducto } from '@/servicios/productos';
import { registrarMovimientoManual } from '@/servicios/stock';

let admin: UsuarioSesion;
let vendedor: UsuarioSesion;

async function sesionDe(email: string) {
  const [usuarioEncontrado] = await baseDeDatos
    .select({ id: usuarios.id })
    .from(usuarios)
    .where(esIgualA(usuarios.email, email));
  const usuarioActivo = await buscarUsuarioActivo(usuarioEncontrado.id);
  if (!usuarioActivo) throw new Error(`Sin usuario ${email}`);
  return usuarioActivo;
}

async function productoPorCodigo(codigo: string) {
  const [producto] = await baseDeDatos
    .select()
    .from(productos)
    .where(esIgualA(productos.codigo, codigo));
  return producto;
}

beforeAll(async () => {
  await migrate(baseDeDatos, { migrationsFolder: 'basedatos/migraciones' });
  await sembrar();
  admin = await sesionDe('admin@marketbool.test');
  vendedor = await sesionDe('vendedor@marketbool.test');
});

describe('moverStock (reglas 1 y 2)', () => {
  caso(
    'dos egresos simultáneos de la última unidad: solo uno se confirma',
    async () => {
      const producto = await productoPorCodigo('BS-015');
      expect(producto.existencia).toBe(1);
      const egreso = { tipo: 'egreso', cantidad: 1, motivo: 'Rotura' };

      const intentosSimultaneos = await Promise.allSettled([
        registrarMovimientoManual(admin, producto.id, egreso),
        registrarMovimientoManual(admin, producto.id, egreso),
      ]);

      const rechazados = intentosSimultaneos.filter(
        (intento) => intento.status === 'rejected'
      );
      expect(
        intentosSimultaneos.filter((intento) => intento.status === 'fulfilled')
      ).toHaveLength(1);
      expect(rechazados).toHaveLength(1);
      const motivo = (rechazados[0] as PromiseRejectedResult).reason;
      expect(motivo).toBeInstanceOf(ApiError);
      expect((motivo as ApiError).code).toBe('STOCK_INSUFICIENTE');
      expect((await productoPorCodigo('BS-015')).existencia).toBe(0);
    }
  );

  caso(
    'la existencia coincide con la suma de movimientos después de operar',
    async () => {
      const producto = await productoPorCodigo('SOB-151');
      await registrarMovimientoManual(admin, producto.id, {
        tipo: 'ingreso',
        cantidad: 10,
        motivo: 'Reposición',
      });
      await registrarMovimientoManual(admin, producto.id, {
        tipo: 'egreso',
        cantidad: 3,
        motivo: 'Uso interno',
      });
      expect((await productoPorCodigo('SOB-151')).existencia).toBe(67);
      await expect(verificarInvariantes()).resolves.toBeUndefined();
    }
  );
});

describe('permisos y validación', () => {
  caso('un vendedor no puede mover stock (403)', async () => {
    const producto = await productoPorCodigo('ACC-FOL');
    await expect(
      registrarMovimientoManual(vendedor, producto.id, {
        tipo: 'ingreso',
        cantidad: 1,
        motivo: 'Reposición',
      })
    ).rejects.toMatchObject({ status: 403, code: 'SIN_PERMISO' });
  });

  caso(
    'la existencia no se acepta en un PATCH (esquema estricto)',
    async () => {
      const producto = await productoPorCodigo('ACC-FOL');
      await expect(
        editarProducto(admin, producto.id, { existencia: 999 })
      ).rejects.toBeInstanceOf(ZodError);
    }
  );
});
