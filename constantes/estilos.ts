export const ESPACIOS = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
} as const;

export const COLUMNAS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

export const TONOS = {
  normal: '',
  suave: 'text-muted-foreground',
  peligro: 'text-destructive',
} as const;

export const TAMANIOS_TEXTO = {
  chico: 'text-xs',
  normal: 'text-sm',
} as const;

export const TITULOS = {
  1: { Etiqueta: 'h1', clases: 'text-2xl font-semibold tracking-tight' },
  2: { Etiqueta: 'h2', clases: 'text-lg font-semibold' },
  3: { Etiqueta: 'h3', clases: 'text-base font-medium' },
} as const;

export const COLOR_CANTIDAD = {
  salida: 'text-destructive',
  entrada: 'text-emerald-700',
} as const;
