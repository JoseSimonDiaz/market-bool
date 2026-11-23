export const ERRORES = {
  JSON_INVALIDO: {
    code: 'JSON_INVALIDO',
    status: 400,
    mensaje: 'El cuerpo no es JSON válido.',
  },
  NO_AUTENTICADO: {
    code: 'NO_AUTENTICADO',
    status: 401,
    mensaje: 'Iniciá sesión para continuar.',
  },
  CREDENCIALES_INVALIDAS: {
    code: 'CREDENCIALES_INVALIDAS',
    status: 401,
    mensaje: 'Email o contraseña incorrectos.',
  },
  SIN_PERMISO: {
    code: 'SIN_PERMISO',
    status: 403,
    mensaje: 'No tenés permiso para esta operación.',
  },
  NO_ENCONTRADO: {
    code: 'NO_ENCONTRADO',
    status: 404,
    mensaje: 'El recurso no existe.',
  },
  CODIGO_DUPLICADO: {
    code: 'CODIGO_DUPLICADO',
    status: 409,
    mensaje: 'Ya existe un producto con ese código.',
  },
  DOCUMENTO_DUPLICADO: {
    code: 'DOCUMENTO_DUPLICADO',
    status: 409,
    mensaje: 'Ya existe un cliente con ese documento.',
  },
  EMAIL_DUPLICADO: {
    code: 'EMAIL_DUPLICADO',
    status: 409,
    mensaje: 'Ya existe un usuario con ese email.',
  },
  NOMBRE_DUPLICADO: {
    code: 'NOMBRE_DUPLICADO',
    status: 409,
    mensaje: 'Ya existe una categoría con ese nombre.',
  },
  CATEGORIA_EN_USO: {
    code: 'CATEGORIA_EN_USO',
    status: 409,
    mensaje: 'La categoría tiene productos activos.',
  },
  STOCK_INSUFICIENTE: {
    code: 'STOCK_INSUFICIENTE',
    status: 409,
    mensaje: 'No hay existencia suficiente.',
  },
  FACTURA_ANULADA: {
    code: 'FACTURA_ANULADA',
    status: 409,
    mensaje: 'La factura ya estaba anulada.',
  },
  VALIDACION: {
    code: 'VALIDACION',
    status: 422,
    mensaje: 'Hay campos con errores.',
  },
  PRODUCTO_INACTIVO: {
    code: 'PRODUCTO_INACTIVO',
    status: 422,
    mensaje: 'El producto está dado de baja.',
  },
  CUENTA_CORRIENTE_NO_HABILITADA: {
    code: 'CUENTA_CORRIENTE_NO_HABILITADA',
    status: 422,
    mensaje: 'El cliente no tiene cuenta corriente habilitada.',
  },
  LIMITE_CREDITO_EXCEDIDO: {
    code: 'LIMITE_CREDITO_EXCEDIDO',
    status: 422,
    mensaje: 'La venta supera el límite de crédito del cliente.',
  },
  MONTO_INSUFICIENTE: {
    code: 'MONTO_INSUFICIENTE',
    status: 422,
    mensaje: 'El monto recibido no cubre el total.',
  },
  PAGO_SUPERA_DEUDA: {
    code: 'PAGO_SUPERA_DEUDA',
    status: 422,
    mensaje: 'El pago es mayor que el saldo del cliente.',
  },
  SALDO_PENDIENTE: {
    code: 'SALDO_PENDIENTE',
    status: 422,
    mensaje: 'El cliente tiene saldo pendiente.',
  },
  CONTRASENA_ACTUAL_INCORRECTA: {
    code: 'CONTRASENA_ACTUAL_INCORRECTA',
    status: 422,
    mensaje: 'La contraseña actual no es correcta.',
  },
  OPERACION_SOBRE_SI_MISMO: {
    code: 'OPERACION_SOBRE_SI_MISMO',
    status: 422,
    mensaje: 'No podés desactivarte ni quitarte el rol de administrador.',
  },
  ERROR_INTERNO: {
    code: 'ERROR_INTERNO',
    status: 500,
    mensaje: 'Ocurrió un error inesperado.',
  },
} as const;

export type DefinicionError = (typeof ERRORES)[keyof typeof ERRORES];
export type CodigoError = DefinicionError['code'];
