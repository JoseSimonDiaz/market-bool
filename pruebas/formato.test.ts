import { describe, expect, it as caso } from 'vitest';
import { finDiaArgentina, inicioDiaArgentina } from '@/lib/fechas';
import {
  formatearDocumento,
  formatearFecha,
  formatearMoneda,
  formatearNumeroComprobante,
  pesosACentavos,
} from '@/lib/formato';

describe('formato', () => {
  caso('moneda argentina', () => {
    expect(formatearMoneda(1234550)).toBe('$ 12.345,50');
  });
  caso('numeración 0001-00000001', () => {
    expect(formatearNumeroComprobante(1, 1233)).toBe('0001-00001233');
  });
  caso('fecha en hora de Argentina', () => {
    expect(formatearFecha('2026-10-30T02:00:00Z')).toBe('29/10/2026');
  });
  caso('documentos', () => {
    expect(formatearDocumento('DNI', '28456123')).toBe('28.456.123');
    expect(formatearDocumento('CUIT', '20284561234')).toBe('20-28456123-4');
  });
  caso('pesos a centavos', () => {
    expect(pesosACentavos('12.345,50')).toBe(1234550);
    expect(pesosACentavos('abc')).toBeNaN();
  });
  caso('rango de día argentino', () => {
    expect(inicioDiaArgentina('2026-10-29')).toBe('2026-10-29T03:00:00.000Z');
    expect(finDiaArgentina('2026-10-29')).toBe('2026-10-30T03:00:00.000Z');
  });
});
