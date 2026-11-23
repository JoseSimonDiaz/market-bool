export const MENSAJES_VALIDACION = {
  obligatorio: 'Es obligatorio.',
  obligatoria: 'Es obligatoria.',
  maximoCaracteres: (maximo: number) => `Máximo ${maximo} caracteres.`,
  minimoCaracteres: (minimo: number) => `Mínimo ${minimo} caracteres.`,
  emailInvalido: 'Email inválido.',
  elegirRol: 'Elegí un rol.',
  distintaDeLaActual: 'Debe ser distinta de la actual.',
  formatoDia: 'Formato AAAA-MM-DD.',
  formatoCodigo: 'Solo letras, números y guiones.',
  ingresarPrecio: 'Ingresá un precio.',
  precioEnCentavos: 'El precio va en centavos.',
  mayorQueCero: 'Debe ser mayor que cero.',
  ingresarNumero: 'Ingresá un número.',
  ingresarCantidad: 'Ingresá una cantidad.',
  numeroEntero: 'Debe ser un número entero.',
  noNegativo: 'No puede ser negativo.',
  elegirCategoria: 'Elegí una categoría.',
  elegirCategoriaActiva: 'Elegí una categoría activa.',
  elegirMotivo: 'Elegí un motivo.',
  elegirTipoDocumento: 'Elegí DNI o CUIT.',
  dniInvalido: 'El DNI tiene 7 u 8 dígitos.',
  cuitInvalido: 'El CUIT tiene 11 dígitos.',
  ingresarImporte: 'Ingresá un importe.',
  importeEnCentavos: 'El importe va en centavos.',
  elegirMedioPago: 'Elegí un medio de pago.',
  ventaSinItems: 'Agregá al menos un producto.',
  clienteDadoDeBaja: 'El cliente está dado de baja.',
  productoRepetido: 'Cada producto va en un solo renglón.',
  ultimosDigitosTarjeta: 'Son exactamente los últimos 4 dígitos.',
  elegirTipoTarjeta: 'Elegí débito o crédito.',
  elegirFormaPago: 'Elegí una forma de pago.',
} as const;

export const MENSAJES_DESPLIEGUE = {
  faltaBaseDeDatos:
    'Falta la base de datos: cargá TURSO_DATABASE_URL o DATABASE_URL en Vercel (Production).',
  faltaSecretoDeSesion:
    'Falta SESSION_SECRET (o es el valor de ejemplo): cargá uno propio de 32 caracteres o más.',
  aplicandoMigraciones: 'Aplicando migraciones…',
  baseVacia: 'Base vacía: se cargan los datos de prueba…',
  baseConDatos: 'La base ya tiene datos: no se cargan datos de prueba.',
  recargaPorSeedReset: (valorPedido: string) =>
    `SEED_RESET=${valorPedido}: se vuelven a cargar los datos de prueba…`,
  deployQueNoTocaLaBase: (entorno: string) =>
    `Deploy de ${entorno}: no se toca la base.`,
} as const;

export const MENSAJES_SISTEMA = {
  sinConexion: 'No se pudo conectar con el servidor.',
} as const;
