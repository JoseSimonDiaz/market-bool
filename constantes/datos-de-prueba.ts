import { ROL } from '@/constantes/dominio';

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
