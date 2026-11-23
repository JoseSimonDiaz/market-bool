import { CENTAVOS_POR_PESO } from '@/constantes/formato';
import {
  FORMA_PAGO,
  ROL,
  TIPO_DOCUMENTO,
  TIPO_TARJETA,
  type FormaPago,
} from '@/constantes/dominio';
import type { DatosAltaCliente } from '@/esquemas/clientes';

export const USUARIOS_DE_PRUEBA = [
  {
    nombre: 'Laura Méndez',
    email: 'admin@marketbool.test',
    password: 'admin1234',
    rol: ROL.admin,
  },
  {
    nombre: 'Pablo Ruiz',
    email: 'vendedor@marketbool.test',
    password: 'vendedor1234',
    rol: ROL.vendedor,
  },
];

export const CATEGORIAS_DE_PRUEBA = [
  'Base Set (1999)',
  'Espada y Escudo',
  'Escarlata y Púrpura',
  'Sobres y cajas',
  'Accesorios',
];

export type FilaProducto = [
  codigo: string,
  descripcion: string,
  indiceCategoria: number,
  precioEnPesos: number,
  stockMinimo: number,
  stockInicial: number,
];

export const PRODUCTOS_DE_PRUEBA: FilaProducto[] = [
  ['BS-004', 'Charizard holo 4/102 (Base Set)', 0, 950000, 1, 2],
  ['BS-002', 'Blastoise holo 2/102 (Base Set)', 0, 420000, 1, 2],
  ['BS-015', 'Venusaur holo 15/102 (Base Set)', 0, 380000, 1, 1],
  ['BS-010', 'Mewtwo holo 10/102 (Base Set)', 0, 260000, 1, 3],
  ['BS-001', 'Alakazam holo 1/102 (Base Set)', 0, 180000, 1, 0],
  ['BS-058', 'Pikachu 58/102 (Base Set)', 0, 45000, 2, 6],
  ['SWSH-044', 'Pikachu VMAX 044/185 (Voltaje Vívido)', 1, 120000, 2, 4],
  ['SWSH-215', 'Umbreon VMAX 215/203 (Cielos Evolutivos)', 1, 1450000, 1, 1],
  ['SWSH-218', 'Rayquaza VMAX 218/203 (Cielos Evolutivos)', 1, 520000, 1, 2],
  [
    'SWSH-020',
    'Charizard VMAX 020/189 (Oscuridad Incandescente)',
    1,
    210000,
    1,
    3,
  ],
  ['SWSH-269', 'Mew V 269/264 (Golpe Fusión)', 1, 95000, 2, 5],
  ['SWSH-065', 'Eevee 065/203 (Cielos Evolutivos)', 1, 8000, 5, 3],
  ['SV-125', 'Charizard ex 125/197 (Llamas Obsidianas)', 2, 160000, 2, 5],
  ['SV-151', 'Mew ex 151/165 (Escarlata y Púrpura 151)', 2, 240000, 1, 2],
  ['SV-081', 'Miraidon ex 081/198 (Escarlata y Púrpura)', 2, 35000, 3, 8],
  ['SV-125K', 'Koraidon ex 125/198 (Escarlata y Púrpura)', 2, 32000, 3, 7],
  ['SV-086', 'Gardevoir ex 086/198 (Escarlata y Púrpura)', 2, 28000, 3, 6],
  ['SV-063', 'Pikachu ex 063/191 (Chispas Fulgurantes)', 2, 70000, 2, 1],
  ['SOB-151', 'Sobre Escarlata y Púrpura 151', 3, 9500, 20, 60],
  ['SOB-PRE', 'Sobre Evoluciones Prismáticas', 3, 11000, 20, 45],
  ['SOB-LLO', 'Sobre Llamas Obsidianas', 3, 7500, 20, 15],
  ['ETB-151', 'Caja de Entrenador Élite 151', 3, 120000, 3, 6],
  ['BOX-SSP', 'Booster box Chispas Fulgurantes (36 sobres)', 3, 290000, 2, 2],
  ['BLI-3', 'Blister 3 sobres + carta promo', 3, 32000, 5, 12],
  ['ACC-FOL', 'Folios Ultra Pro x100', 4, 9000, 10, 40],
  ['ACC-TOP', 'Top loaders x25', 4, 7000, 10, 30],
  ['ACC-CAR', 'Carpeta de 9 bolsillos', 4, 25000, 4, 10],
  ['ACC-DBX', 'Deck box Pokébola', 4, 15000, 4, 3],
  ['ACC-MAT', 'Playmat Pikachu', 4, 30000, 2, 5],
  ['ACC-DAD', 'Set de dados y contadores de daño', 4, 6000, 5, 12],
];

export const CLIENTES_DE_PRUEBA: DatosAltaCliente[] = [
  {
    tipoDoc: TIPO_DOCUMENTO.dni,
    nroDoc: '30111222',
    nombre: 'Martina Gómez',
    domicilio: 'Av. Belgrano 1250, San Miguel de Tucumán',
    telefono: '381 455-1020',
    email: 'martina.gomez@correo.test',
    cuentaCorriente: true,
    limiteCredito: 300000 * CENTAVOS_POR_PESO,
  },
  {
    tipoDoc: TIPO_DOCUMENTO.dni,
    nroDoc: '35444777',
    nombre: 'Lucas Fernández',
    domicilio: 'San Martín 870, Yerba Buena',
    telefono: '381 512-3344',
    email: 'lucas.fernandez@correo.test',
    cuentaCorriente: true,
    limiteCredito: 200000 * CENTAVOS_POR_PESO,
  },
  {
    tipoDoc: TIPO_DOCUMENTO.cuit,
    nroDoc: '30712345678',
    nombre: 'Liga Pokémon Tucumán Asociación Civil',
    domicilio: 'Mendoza 455, San Miguel de Tucumán',
    telefono: '381 430-9900',
    email: 'contacto@ligatucuman.test',
    cuentaCorriente: true,
    limiteCredito: null,
  },
  {
    tipoDoc: TIPO_DOCUMENTO.cuit,
    nroDoc: '20287654321',
    nombre: 'Coleccionables del Norte',
    domicilio: 'Córdoba 1520, San Miguel de Tucumán',
    telefono: '381 421-7788',
    email: 'ventas@coleccionablesnorte.test',
    cuentaCorriente: true,
    limiteCredito: 400000 * CENTAVOS_POR_PESO,
  },
  {
    tipoDoc: TIPO_DOCUMENTO.dni,
    nroDoc: '41222333',
    nombre: 'Sofía Herrera',
    domicilio: 'Laprida 230, San Miguel de Tucumán',
    telefono: '381 600-1122',
    email: 'sofia.herrera@correo.test',
  },
  {
    tipoDoc: TIPO_DOCUMENTO.dni,
    nroDoc: '38999000',
    nombre: 'Tomás Álvarez',
    domicilio: 'Junín 1100, San Miguel de Tucumán',
    telefono: '381 622-4455',
  },
  {
    tipoDoc: TIPO_DOCUMENTO.dni,
    nroDoc: '43555666',
    nombre: 'Valentina Ríos',
    telefono: '381 633-7788',
    email: 'valen.rios@correo.test',
  },
  {
    tipoDoc: TIPO_DOCUMENTO.dni,
    nroDoc: '27888111',
    nombre: 'Diego Paz',
    domicilio: 'Santiago del Estero 640, San Miguel de Tucumán',
    telefono: '381 644-0099',
  },
  {
    tipoDoc: TIPO_DOCUMENTO.dni,
    nroDoc: '45111999',
    nombre: 'Camila Juárez',
    email: 'cami.juarez@correo.test',
  },
  {
    tipoDoc: TIPO_DOCUMENTO.dni,
    nroDoc: '33666444',
    nombre: 'Federico Medina',
    domicilio: 'Marcos Paz 310, Yerba Buena',
    telefono: '381 655-2233',
  },
];

export type RenglonDePrueba = [codigo: string, cantidad: number];

export type PlantillaDeVenta = {
  forma: FormaPago;
  renglones: RenglonDePrueba[];
};

export const PLANTILLAS_DE_VENTA: PlantillaDeVenta[] = [
  {
    forma: FORMA_PAGO.contado,
    renglones: [
      ['SOB-151', 3],
      ['ACC-FOL', 1],
    ],
  },
  {
    forma: FORMA_PAGO.tarjeta,
    renglones: [
      ['SOB-PRE', 2],
      ['ACC-TOP', 1],
    ],
  },
  {
    forma: FORMA_PAGO.cuentaCorriente,
    renglones: [
      ['SV-081', 1],
      ['SOB-151', 2],
    ],
  },
  {
    forma: FORMA_PAGO.contado,
    renglones: [
      ['BLI-3', 1],
      ['ACC-DAD', 1],
    ],
  },
  {
    forma: FORMA_PAGO.tarjeta,
    renglones: [
      ['SOB-151', 2],
      ['ACC-FOL', 2],
    ],
  },
  { forma: FORMA_PAGO.contado, renglones: [['SOB-PRE', 3]] },
  {
    forma: FORMA_PAGO.cuentaCorriente,
    renglones: [
      ['ACC-CAR', 1],
      ['SOB-PRE', 1],
    ],
  },
  {
    forma: FORMA_PAGO.contado,
    renglones: [
      ['ACC-TOP', 2],
      ['SOB-LLO', 1],
    ],
  },
  {
    forma: FORMA_PAGO.tarjeta,
    renglones: [
      ['SV-125K', 1],
      ['ACC-FOL', 1],
    ],
  },
  {
    forma: FORMA_PAGO.contado,
    renglones: [
      ['SOB-151', 1],
      ['SV-125', 1],
    ],
  },
];

export const TARJETAS_DE_PRUEBA = [
  { tipo: TIPO_TARJETA.debito, marca: 'Visa', ultimos4: '4821' },
  { tipo: TIPO_TARJETA.credito, marca: 'Mastercard', ultimos4: '1934' },
  { tipo: TIPO_TARJETA.credito, marca: 'American Express', ultimos4: '0057' },
];

export const CALENDARIO_DE_PRUEBA = {
  cantidadDeFacturas: 50,
  diasConFacturas: 30,
  horaDeApertura: 10,
  horasDeAtencion: 9,
  minutosHastaElPago: 60,
  cadaCuantasAConsumidorFinal: 2,
} as const;

export const PAGOS_DE_PRUEBA = {
  cadaCuantasVentasACuenta: 2,
  posicionDeLaQueSePaga: 1,
  fraccionDelSaldo: 0.5,
  observacion: 'Pago a cuenta',
} as const;

export const ANULACION_DE_PRUEBA = {
  indiceDeLaFactura: 42,
  motivo: 'Error en la carga de la venta',
} as const;
