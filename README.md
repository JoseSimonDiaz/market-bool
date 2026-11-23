# market-bool

Sistema de gestión comercial para **market-bool**, una tienda de cartas Pokémon de un solo local. Permite administrar el catálogo de cartas, sobres y accesorios con control de stock, registrar ventas con su comprobante y llevar la cuenta corriente de los clientes.

Trabajo del 2º parcial de Programación IV (TUP). Es un monolito Next.js: la interfaz y la API REST viven en el mismo proyecto.

**URL pública:** https://market-bool.vercel.app/

## Integrantes

| Nombre | GitHub |
| --- | --- |
| Roldan Enzo | [@Roldanebzo](https://github.com/Roldanebzo) |
| Diaz Jose | [@JoseSimonDiaz](https://github.com/JoseSimonDiaz) |

## Funcionalidades

- **Inicio:** tablero con las ventas del día y del mes, el ticket promedio, el total adeudado en cuentas corrientes y la cantidad de productos bajo el mínimo. Muestra un gráfico de ventas diarias de los últimos 30 días, otro con las ventas del mes por forma de pago y los 5 productos más vendidos del mes.
- **Usuarios y acceso:** inicio de sesión con dos roles, administrador y vendedor. El administrador da de alta usuarios, los desactiva y restablece contraseñas; cada usuario puede cambiar la suya.
- **Productos y stock:** catálogo con búsqueda, filtros y paginación, categorías (expansiones), ingresos y ajustes de stock con motivo, historial de movimientos y aviso de stock bajo el mínimo.
- **Clientes:** alta y edición, ficha con las últimas facturas, cuenta corriente con saldo acumulado, registro de pagos con recibo numerado e imprimible y listado de deudores.
- **Ventas:** nueva venta en una sola pantalla (comprador, ítems y forma de pago) que se maneja con el teclado. Se puede pagar en contado, con tarjeta o en cuenta corriente con límite de crédito. Cada venta emite una factura numerada sin huecos y con comprobante imprimible. Hay un listado de facturas con filtros, y el administrador puede anular una factura indicando el motivo.

## Stack

| Capa | Tecnología |
| --- | --- |
| Lenguaje | TypeScript |
| Framework | Next.js 16 (App Router, Route Handlers y Server Actions) |
| Estilos y componentes | Tailwind CSS 4 y shadcn/ui |
| Gráficos | Chart.js con `react-chartjs-2` |
| Base de datos | SQLite en desarrollo y Turso (libSQL) en producción |
| Acceso a datos | Drizzle ORM con migraciones de `drizzle-kit` |
| Validación y formularios | Zod 4, con los mismos esquemas en cliente y servidor, y TanStack Form |
| Autenticación | Sesión propia en una cookie firmada (`jose`), con contraseñas hasheadas con `bcryptjs` |
| Pruebas | Vitest para los servicios y Playwright para el navegador |
| Hosting | Vercel |

## Instalación

Requiere Node 22.9 o superior y pnpm.

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

La aplicación queda en http://localhost:3000.

## Variables de entorno

Están listadas en `.env.example`.

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | En desarrollo, `file:local.db` (es el valor por defecto si queda vacía). En producción, la URL `libsql://…` de Turso. |
| `DATABASE_AUTH_TOKEN` | Token de Turso. En desarrollo queda vacío. |
| `SESSION_SECRET` | Clave para firmar la cookie de sesión, de 32 caracteres como mínimo. |
| `SEED_RESET` | Opcional. En producción, al cambiar su valor, el siguiente deploy vuelve a cargar los datos de prueba. |

## Datos de prueba

`pnpm db:seed` carga 2 usuarios, 5 categorías, 30 productos, 10 clientes y 50 facturas repartidas en los últimos 30 días, con pagos a cuenta y una factura anulada. Las ventas, los pagos y la anulación se registran con los mismos servicios que usa la aplicación, así que el stock, los saldos y la numeración cumplen todas las reglas.

## Usuarios de prueba

| Rol | Email | Contraseña |
| --- | --- | --- |
| Administrador | `admin@marketbool.test` | `admin1234` |
| Vendedor | `vendedor@marketbool.test` | `vendedor1234` |

## Scripts

| Script | Qué hace |
| --- | --- |
| `pnpm dev` | Levanta el servidor de desarrollo. |
| `pnpm build` | Aplica las migraciones, carga los datos de prueba si la base está vacía y compila la aplicación. |
| `pnpm db:migrate` | Aplica las migraciones. |
| `pnpm db:seed` | Carga los datos de prueba. |
| `pnpm test` | Corre las pruebas de los servicios. |
| `pnpm test:e2e` | Corre las pruebas en el navegador. |
| `pnpm lint` / `pnpm typecheck` | Revisan el estilo y los tipos. |

## Organización del código

```
basedatos/    esquema de Drizzle, conexión, consultas comunes y migraciones
servicios/    reglas de negocio, validación y permisos (no conocen HTTP)
adaptadores/  sesión, Route Handlers, Server Actions y traducción de errores a HTTP
app/api/      la API REST
app/(sistema) las pantallas del sistema, con el panel lateral
esquemas/     esquemas Zod compartidos por los formularios y los servicios
componentes/  componentes de interfaz y de cada módulo
constantes/   valores fijos: roles, permisos, rutas, errores y mensajes
lib/          utilidades puras: formato de importes y fechas, cálculos de la venta
scripts/      carga de datos de prueba y preparación del deploy
proxy.ts      control de acceso a páginas y endpoints según el rol
```

- Todas las reglas de negocio están en la capa de servicios, y la usan tanto la API como las pantallas.
- La existencia de un producto solo cambia a través de `moverStock()`. Esa función registra el movimiento en la misma transacción y nunca deja el stock en negativo.
- El saldo de un cliente no se guarda: se calcula a partir de sus movimientos de cuenta corriente.
- Los importes se guardan en centavos y se muestran como `$ 12.345,50`. Las fechas se muestran en `dd/mm/aaaa`, hora de Argentina.

## API REST

La API está bajo `/api` y responde en JSON. Las listas se paginan con `page` y `pageSize` y devuelven `{ data, page, pageSize, total }`. Los errores tienen la forma `{ "error": { "code", "message", "details" } }`.

El enunciado da rutas orientativas. Las adaptamos para que ningún segmento lleve guion:

| Enunciado | market-bool |
| --- | --- |
| `POST /api/usuarios/{id}/reset-password` | `POST /api/usuarios/{id}/password` |
| `GET /api/movimientos-stock` | `GET /api/movimientos` |
| `GET /api/facturas/proximo-numero` | `GET /api/facturas/numeracion` |

El resto de las rutas son las del enunciado:

- **Sesión:** `auth/login`, `auth/logout`, `auth/me` y `auth/password`.
- **Catálogo:** `usuarios`, `categorias`, `productos` y `productos/{id}/movimientos`.
- **Clientes:** `clientes`, `clientes/{id}/cuenta`, `clientes/{id}/pagos` y `pagos/{id}`.
- **Ventas:** `facturas`, `facturas/{id}` y `facturas/{id}/anulacion`.
- **Inicio:** `tablero`.
