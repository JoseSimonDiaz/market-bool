import { beforeAll, describe, expect, it as caso } from 'vitest';
import { baseDeDatos } from '@/basedatos/conexion';
import { movimientosCuenta } from '@/basedatos/esquema';
import type { UsuarioSesion } from '@/esquemas/usuarios';
import { prepararBaseConDatosDePrueba, sesionDe } from '@/pruebas/ayudantes';
import {
  crearCliente,
  editarCliente,
  listarClientes,
  obtenerCliente,
} from '@/servicios/clientes';
import { consultarCuentaCorriente } from '@/servicios/cuenta-corriente';
import { ApiError } from '@/servicios/errores';
import { obtenerPago, registrarPago } from '@/servicios/pagos';

let vendedor: UsuarioSesion;

function codigoDelError(intento: Promise<unknown>) {
  return intento.then(
    () => null,
    (error: unknown) => (error instanceof ApiError ? error.code : error)
  );
}

async function clienteConDeuda(nroDoc: string, deuda: number) {
  const cliente = await crearCliente(vendedor, {
    tipoDoc: 'DNI',
    nroDoc,
    nombre: `Cliente ${nroDoc}`,
    cuentaCorriente: true,
  });
  await baseDeDatos.insert(movimientosCuenta).values({
    clienteId: cliente.id,
    tipo: 'debito',
    importe: deuda,
    descripcion: 'Deuda de prueba',
  });
  return cliente;
}

beforeAll(async () => {
  await prepararBaseConDatosDePrueba();
  vendedor = await sesionDe('vendedor@marketbool.test');
});

describe('clientes', () => {
  caso('el documento se guarda sin puntos y no se repite', async () => {
    const cliente = await crearCliente(vendedor, {
      tipoDoc: 'DNI',
      nroDoc: '28.456.123',
      nombre: 'Mariana López',
    });
    expect(cliente).toMatchObject({ nroDoc: '28.456.123', saldo: 0 });
    expect(
      await codigoDelError(
        crearCliente(vendedor, {
          tipoDoc: 'DNI',
          nroDoc: '28456123',
          nombre: 'Otra',
        })
      )
    ).toBe('DOCUMENTO_DUPLICADO');
  });

  caso('busca por documento sin importar puntos ni guiones', async () => {
    const listado = await listarClientes(vendedor, { q: '28-456' });
    expect(listado.data.map(({ nombre }) => nombre)).toEqual(['Mariana López']);
  });

  caso('no se da de baja ni se corta la cuenta con saldo', async () => {
    const cliente = await clienteConDeuda('30111222', 50_000);
    expect(
      await codigoDelError(
        editarCliente(vendedor, cliente.id, { activo: false })
      )
    ).toBe('SALDO_PENDIENTE');
    expect(
      await codigoDelError(
        editarCliente(vendedor, cliente.id, { cuentaCorriente: false })
      )
    ).toBe('SALDO_PENDIENTE');
  });

  caso('saldos: solo deudores, de mayor a menor, con el total', async () => {
    await clienteConDeuda('30111333', 90_000);
    const deudores = await listarClientes(vendedor, {
      conDeuda: 'true',
      orden: 'saldo',
    });
    expect(deudores.data.map(({ saldo }) => saldo)).toEqual([90_000, 50_000]);
    expect(deudores.totalAdeudado).toBe(140_000);
  });
});

describe('pagos (reglas 7 y 8)', () => {
  caso('un pago acredita la cuenta y numera el recibo', async () => {
    const cliente = await clienteConDeuda('30111444', 100_000);
    const primero = await registrarPago(vendedor, cliente.id, {
      importe: 40_000,
      medio: 'transferencia',
    });
    const segundo = await registrarPago(vendedor, cliente.id, {
      importe: 10_000,
      medio: 'efectivo',
    });
    expect(primero).toMatchObject({
      numeroRecibo: 'R 0001-00000001',
      saldoCliente: 60_000,
    });
    expect(segundo).toMatchObject({
      numeroRecibo: 'R 0001-00000002',
      saldoCliente: 50_000,
    });
    expect((await obtenerPago(vendedor, primero.id)).saldoCliente).toBe(60_000);
    const cuenta = await consultarCuentaCorriente(vendedor, cliente.id, {});
    expect(cuenta.movimientos.map(({ saldo }) => saldo)).toEqual([
      100_000, 60_000, 50_000,
    ]);
    expect((await obtenerCliente(vendedor, cliente.id)).saldo).toBe(
      cuenta.saldo
    );
  });

  caso('un pago no supera la deuda, ni con dos pagos simultáneos', async () => {
    const cliente = await clienteConDeuda('30111555', 30_000);
    const pagoTotal = { importe: 30_000, medio: 'efectivo' };
    const intentos = await Promise.allSettled([
      registrarPago(vendedor, cliente.id, pagoTotal),
      registrarPago(vendedor, cliente.id, pagoTotal),
    ]);
    expect(
      intentos.filter(({ status }) => status === 'fulfilled')
    ).toHaveLength(1);
    expect((await obtenerCliente(vendedor, cliente.id)).saldo).toBe(0);
    expect(
      await codigoDelError(registrarPago(vendedor, cliente.id, pagoTotal))
    ).toBe('PAGO_SUPERA_DEUDA');
  });

  caso('sin cuenta corriente no se registran pagos', async () => {
    const cliente = await crearCliente(vendedor, {
      tipoDoc: 'CUIT',
      nroDoc: '20-30111666-1',
      nombre: 'Sin cuenta',
    });
    expect(
      await codigoDelError(
        registrarPago(vendedor, cliente.id, { importe: 1, medio: 'efectivo' })
      )
    ).toBe('CUENTA_CORRIENTE_NO_HABILITADA');
  });
});
