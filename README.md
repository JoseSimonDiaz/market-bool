# market-bool

Sistema de gestión comercial de **market-bool**, una tienda de cartas Pokémon de un solo local: catálogo de cartas, sobres y accesorios con control de stock, facturación y cuenta corriente de clientes.

2º parcial de Programación IV (TUP). Monolito Next.js: la interfaz y la API REST viven en el mismo proyecto.

## Estado por partes

El desarrollo se divide en 3 partes, con commits por tema dentro de cada una.

| Parte | Alcance | Estado |
| --- | --- | --- |
| 1 | Base del proyecto, sesión, usuarios, categorías, productos y stock (RF-U, RF-P) | ✅ |
| 2 | Clientes, cuenta corriente, pagos y ventas (RF-C, RF-V) | Pendiente |
| 3 | Tablero (RF-T), datos de prueba completos y entrega | Pendiente |

## Stack

TypeScript · Next.js 16 (App Router, Route Handlers, Server Actions) · Tailwind 4 · shadcn/ui · Drizzle ORM + drizzle-kit · SQLite en desarrollo y Turso (libSQL) en producción · Zod 4 · TanStack Form · sesión propia en cookie firmada (`jose`, `bcryptjs`) · Chart.js · Vercel.

## Puesta en marcha local

Requiere Node 22.9 o superior y pnpm.

```bash
pnpm install
cp .env.example .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

Abrir http://localhost:3000 e ingresar con un usuario de prueba.

### Usuarios de prueba

| Rol | Email | Contraseña |
| --- | --- | --- |
| Administrador | `admin@marketbool.test` | `admin1234` |
| Vendedor | `vendedor@marketbool.test` | `vendedor1234` |

### Variables de entorno (`.env.example`)

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | `file:local.db` en desarrollo; la URL `libsql://…` de Turso en producción (también se acepta `TURSO_DATABASE_URL`). |
| `DATABASE_AUTH_TOKEN` | Token de Turso (también `TURSO_AUTH_TOKEN`). Vacío en local. |
| `SESSION_SECRET` | Firma de la cookie de sesión, 32 caracteres como mínimo. En producción no puede ser el valor de ejemplo. |
| `SEED_RESET` | Opcional, solo producción: si cambia su valor, el próximo deploy recarga los datos de prueba (una vez por valor). |

### Scripts

| Script | Qué hace |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo. |
| `pnpm build` | Corre `scripts/desplegar.ts` y después `next build`. En Vercel Production aplica migraciones y carga los datos si la base está vacía; los previews no tocan la base. |
| `pnpm db:generate` | Genera una migración a partir de `basedatos/esquema.ts`. |
| `pnpm db:migrate` / `pnpm db:seed` | Aplican las migraciones y cargan los datos de prueba. |
| `pnpm test` | Tests de servicios con vitest, sobre una base propia (`pruebas/prueba.db`). |
| `pnpm lint` / `pnpm typecheck` | ESLint + Prettier, y TypeScript. |

## Arquitectura

Cada regla de negocio vive en un único lugar: la capa de servicios (sección 10 del enunciado).

```
basedatos/    datos: esquema (Drizzle), conexión, consultas comunes (paginado, condiciones, unicidad), migraciones
servicios/    reglas de negocio: auth, usuarios, categorias, productos, stock, permisos, reglas-comunes, errores
adaptadores/  HTTP y Next: rutas, acciones, sesión, páginas, traducción de errores a HTTP, cliente de la API
app/api/      Route Handlers finos: adaptador → servicio → respuesta
acciones/     Server Actions finas, devuelven { ok, data } | { ok: false, error }
esquemas/     esquemas Zod compartidos por formularios y servicios (strictObject en altas y ediciones)
lib/          utilidades puras sin dependencias de capas: formato, fechas, token, coincidencia de rutas
constantes/   todo valor fijo: dominio, errores, mensajes, permisos por rol, rutas, http, seguridad
app/(sistema) páginas con panel lateral y barra superior; /login queda fuera del layout
componentes/  ui (shadcn), primitivas de maquetación, estructura, comunes (campos, filtros) y dominio
hooks/        useFormulario (createFormHook de TanStack Form + el mismo Zod del servidor), useConfirmacion
scripts/      semilla (datos de prueba con los servicios) y desplegar (migraciones + seed en Vercel)
proxy.ts      autorización por rol: páginas y endpoints permitidos por rol, como en el proyecto de referencia
```

- **Proxy:** el rol viaja en el JWT y `proxy.ts` lo valida contra `PAGINAS_POR_ROL` y `ENDPOINTS_POR_ROL` (`constantes/permisos.ts`). En la API responde 401 sin sesión y 403 sin permiso; en las páginas redirige a `/login` o a `/sinpermiso`.

- **Servicios:** cada función recibe `(usuario, datosSinValidar)` y sigue el orden validar → permiso → reglas → resultado. Cada una cita su requerimiento (`// RF-P5`).
- **Stock:** la existencia solo cambia en `moverStock()` (`servicios/stock.ts`). El `UPDATE … WHERE existencia + ? >= 0` y el movimiento se graban en la misma transacción; además hay un `CHECK (existencia >= 0)` en la tabla.
- **Transacciones:** pasan por `ejecutarEnTransaccionSerializada()` (`basedatos/conexion.ts`), que encola las del mismo proceso. El driver local es sincrónico y dos transacciones simultáneas se bloquearían entre sí.
- **Errores:** los servicios lanzan solo `ApiError(status, code, message, details)` con los códigos de la sección 11.8. Un `ZodError` se convierte en `422 VALIDACION` con el detalle por campo. Lo inesperado se registra y responde `500 ERROR_INTERNO` sin detalle.
- **Sesión:** cookie `httpOnly` y `SameSite=Lax` firmada con HS256 (lleva id y rol). El usuario se busca en la base en cada pedido, una sola vez aunque lo pidan el layout y la página, así que uno desactivado pierde el acceso aunque conserve la cookie. Hay tres barreras: proxy (rol del token), página (usuario válido) y servicio (rol contra la base).
- **Importes y fechas:** los importes son enteros en centavos y se muestran como `$ 12.345,50`. Las fechas se guardan en ISO UTC y se muestran en `dd/mm/aaaa`, hora de Argentina.

## API REST

Toda la API vive bajo `/api` y habla JSON. Hay una sola diferencia con el enunciado: **ningún segmento de ruta lleva guion**, por la regla REST del proyecto.

| market-bool | Enunciado (sección 11) | Rol |
| --- | --- | --- |
| `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `PUT /api/auth/password` | igual | Público / ambos |
| `GET/POST /api/usuarios`, `PATCH /api/usuarios/{id}` | igual | Admin |
| `POST /api/usuarios/{id}/password` | `POST /api/usuarios/{id}/reset-password` | Admin |
| `GET/POST /api/categorias`, `PATCH /api/categorias/{id}` | igual | Ambos / admin |
| `GET/POST /api/productos`, `GET/PATCH /api/productos/{id}` | igual | Ambos / admin |
| `GET/POST /api/productos/{id}/movimientos` | igual | Ambos / admin |
| `GET /api/movimientos` | `GET /api/movimientos-stock` | Ambos |
| `GET /api/facturas/numeracion` (parte 2) | `GET /api/facturas/proximo-numero` | Ambos |

Las bajas son lógicas (`PATCH` con `{"activo": false}`). Las listas paginan con `page` y `pageSize` (20 por defecto, 100 como máximo) y responden `{ data, page, pageSize, total }`. Los errores siempre tienen la forma `{ "error": { "code", "message", "details" } }`.

## Requerimientos implementados (parte 1)

| Código | Dónde |
| --- | --- |
| RF-U1, RF-U2 | `servicios/auth.ts`, `adaptadores/sesion.ts`, `proxy.ts`, `app/login` |
| RF-U3 | `scripts/semilla.ts` (primer administrador) |
| RF-U4, RF-U5 | `servicios/usuarios.ts`, `servicios/auth.ts` (`cambiarPassword`), `app/(sistema)/usuarios`, `app/(sistema)/perfil` |
| RF-P1 a RF-P3 | `servicios/productos.ts`, `app/(sistema)/productos` |
| RF-P4 a RF-P6 | `servicios/stock.ts` (`moverStock`), ficha del producto y pestaña Existencias |
| RF-P7 | `servicios/categorias.ts`, `app/(sistema)/productos/categorias` |

## Publicación (Vercel + Turso)

Se siguen los pasos de `apuntes/31.Publicar-vercel-turso`:

1. Subir el repositorio a GitHub y revisar que no estén `.env` ni `local.db`.
2. Importar el repositorio en Vercel.
3. Crear la base en Turso, ya sea con la integración de Vercel o cargando `DATABASE_URL` y `DATABASE_AUTH_TOKEN` solo en Production.
4. Cargar `SESSION_SECRET`, por ejemplo el resultado de `crypto.randomUUID() + crypto.randomUUID()`.
5. Hacer Redeploy. El log muestra «Aplicando migraciones…» y «Base vacía: se cargan los datos de prueba…».

