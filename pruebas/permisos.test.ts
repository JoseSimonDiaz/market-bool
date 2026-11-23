import { describe, expect, it as caso } from 'vitest';
import { ROL } from '@/constantes/dominio';
import { METODO_HTTP } from '@/constantes/http';
import { ENDPOINTS_POR_ROL, PAGINAS_POR_ROL } from '@/constantes/permisos';
import { RUTAS, RUTAS_API, SEGMENTO_ID } from '@/constantes/rutas';
import { endpointPermitido, paginaPermitida } from '@/lib/coincidencia-rutas';

const ID_DE_PRUEBA = '7';

describe('autorización por rol del proxy', () => {
  caso('el vendedor ve el catálogo y la ficha, pero no usuarios', () => {
    const paginasDelVendedor = PAGINAS_POR_ROL[ROL.vendedor];
    expect(paginaPermitida(RUTAS.productos, paginasDelVendedor)).toBe(true);
    expect(
      paginaPermitida(RUTAS.producto(Number(ID_DE_PRUEBA)), paginasDelVendedor)
    ).toBe(true);
    expect(paginaPermitida(RUTAS.usuarios, paginasDelVendedor)).toBe(false);
  });

  caso('el admin entra a usuarios', () => {
    expect(paginaPermitida(RUTAS.usuarios, PAGINAS_POR_ROL[ROL.admin])).toBe(
      true
    );
  });

  caso('el vendedor lee productos pero no los modifica ni mueve stock', () => {
    const reglasDelVendedor = ENDPOINTS_POR_ROL[ROL.vendedor];
    const rutaProducto = RUTAS_API.producto.replace(SEGMENTO_ID, ID_DE_PRUEBA);
    const rutaMovimientos = RUTAS_API.movimientosDeProducto.replace(
      SEGMENTO_ID,
      ID_DE_PRUEBA
    );
    expect(
      endpointPermitido(rutaProducto, METODO_HTTP.get, reglasDelVendedor)
    ).toBe(true);
    expect(
      endpointPermitido(rutaProducto, METODO_HTTP.patch, reglasDelVendedor)
    ).toBe(false);
    expect(
      endpointPermitido(rutaMovimientos, METODO_HTTP.post, reglasDelVendedor)
    ).toBe(false);
  });

  caso('un segmento no matchea más de un tramo de la ruta', () => {
    const reglasDelAdmin = ENDPOINTS_POR_ROL[ROL.admin];
    expect(
      endpointPermitido(
        `${RUTAS_API.producto.replace(SEGMENTO_ID, ID_DE_PRUEBA)}/otra`,
        METODO_HTTP.get,
        reglasDelAdmin
      )
    ).toBe(false);
  });
});
