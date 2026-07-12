# Book Shop API — Práctica final módulo Backend Avanzado

API REST de compraventa de libros con arquitectura hexagonal. Permite a usuarios registrados publicar, editar, eliminar y comprar libros. Incluye notificaciones por email mediante colas BullMQ y un cron job de revisión de precios.

## Requisitos

- Node.js v22+ (ver `.nvmrc`)
- Docker + docker compose

## Instalación

```bash
# 1. Instalar dependencias
npm install
# 2. Variables de entorno
cp .env.example .env
# 3. Levantar la base de datos PostgreSQL
docker compose up -d
# 4. Generar el cliente de Prisma y ejecutar la migración inicial
npm run prisma:sync
# 5. Seed de datos de prueba
npm run prisma:seed
# 6. Arrancar el servidor en modo desarrollo (con live reload)
npm start
```

## Infraestructura (Docker)

El archivo `docker-compose.yml` levanta los siguientes servicios:

| Servicio      | Imagen            | Puerto         | Descripción                    |
| ------------- | ----------------- | -------------- | ------------------------------ |
| PostgreSQL 16 | `postgres:16`     | `5432`         | Base de datos                  |
| pgAdmin       | `dpage/pgadmin4`  | `8081`         | Interfaz gráfica para Postgres |
| Redis 7       | `redis:7`         | `6379`         | Broker de mensajería (BullMQ)  |
| MailDev       | `maildev/maildev` | `1080`, `1025` | Servidor SMTP de desarrollo    |

Credenciales de pgAdmin: `admin@admin.com` / `admin`

Los emails enviados pueden visualizarse en <http://localhost:1080>.

## Variables de entorno

| Variable       | Descripción                                        | Ejemplo                                                  |
| -------------- | -------------------------------------------------- | -------------------------------------------------------- |
| `DB_URL`       | Cadena de conexión de PostgreSQL                   | `postgresql://admin:admin123@localhost:5432/BookShopApi` |
| `JWT_SECRET`   | Clave secreta para firmar JWTs                     | `supersecret`                                            |
| `NODE_ENV`     | Entorno (`local`, `staging`, `production`, `test`) | `local`                                                  |
| `PORT`         | Puerto del servidor HTTP                           | `3000`                                                   |
| `REDIS_URL`    | URL de conexión de Redis                           | `redis://localhost:6379`                                 |
| `MAILDEV_HOST` | Host del servidor SMTP (MailDev)                   | `localhost`                                              |
| `MAILDEV_PORT` | Puerto del servidor SMTP                           | `1025`                                                   |

## Scripts

| Script                 | Descripción                                       |
| ---------------------- | ------------------------------------------------- |
| `npm start`            | Arranca en modo desarrollo con hot reload         |
| `npm run build`        | Compila TypeScript a `dist/`                      |
| `npm test`             | Ejecuta tests de integración (Jest)               |
| `npm run typecheck`    | Chequeo de tipos (tsc --noEmit)                   |
| `npm run lint`         | ESLint sobre `src/`                               |
| `npm run prettier`     | Verifica formato con Prettier                     |
| `npm run prisma:sync`  | Ejecuta migraciones pendientes                    |
| `npm run prisma:seed`  | Puebla la base de datos con datos de prueba       |
| `npm run prisma:reset` | Reinicia la base de datos (borra todos los datos) |

## Endpoints

### Autenticación

| Método | Ruta                     | Descripción       | Auth |
| ------ | ------------------------ | ----------------- | ---- |
| POST   | `/authentication/signup` | Registrar usuario | No   |
| POST   | `/authentication/login`  | Iniciar sesión    | No   |

### Libros

| Método | Ruta             | Descripción                                 | Auth |
| ------ | ---------------- | ------------------------------------------- | ---- |
| GET    | `/books`         | Listar libros publicados (catálogo público) | No   |
| POST   | `/books`         | Crear libro                                 | Sí   |
| PUT    | `/books/:id`     | Actualizar libro propio                     | Sí   |
| DELETE | `/books/:id`     | Eliminar libro propio (no vendido)          | Sí   |
| POST   | `/books/:id/buy` | Comprar un libro de otro usuario            | Sí   |
| GET    | `/me/books`      | Listar mis libros (todos los estados)       | Sí   |

Parámetros de consulta soportados por `GET /books`:

| Parámetro | Descripción        | Ejemplo        |
| --------- | ------------------ | -------------- |
| `page`    | Número de página   | `?page=2`      |
| `limit`   | Libros por página  | `?limit=10`    |
| `search`  | Búsqueda por texto | `?search=dune` |

## Usuarios de prueba

El seed genera dos usuarios:

| Email                | Contraseña          |
| -------------------- | ------------------- |
| `john.doe@email.com` | `validPassword123!` |
| `admin@email.com`    | `validPassword123!` |

También se generan 10 libros con datos aleatorios, repartidos entre ambos usuarios y con una mezcla de estados `PUBLISHED` y `SOLD`.

## Arquitectura

El proyecto sigue Clean Architecture con tres capas:

```
domain/         → Entidades, casos de uso, interfaces
infrastructure/ → Adaptadores concretos (Prisma, BullMQ, Nodemailer)
ui/             → Controladores, rutas, validadores, middleware
```

- **Validación**: Zod v4 sobre los inputs HTTP antes de llegar a los casos de uso
- **Colas**: BullMQ sobre Redis para envío de emails asíncrono (notificación de venta) y cron job semanal (revisión de precios)
- **Errores**: Jerarquía de errores de dominio mapeada a códigos HTTP por el error handler middleware
- **Auth**: JWT firmado con bcrypt para hash de contraseñas

## Estructura del proyecto

```
src/
├── domain/                           # Capa de dominio
│   ├── shared/                         # Entidad base, interfaces
│   │   ├── EmailService.ts               # Servicio de envío de emails
│   │   ├── Entity.ts                     # Clase base de entidades
│   │   ├── QueueService.ts               # Servicio de colas
│   │   └── Pagination.ts                 # Interfaz de paginación
│   ├── errors/                         # Errores de dominio
│   │   ├── BadSyntaxError.ts             # 400
│   │   ├── UnauthorizedError.ts          # 401
│   │   ├── ForbiddenOperationError.ts    # 403
│   │   ├── EntityNotFoundError.ts        # 404
│   │   ├── BusinessConflictError.ts      # 409
│   │   └── ConfigurationError.ts         # 500
│   ├── book/                           # Entidad Book + casos de uso
│   │   ├── Book.ts
│   │   ├── use-cases/                    # create, find, buy, update, delete
│   │   ├── repositories/                 # BookRepository
│   │   └── types/
│   └── user/                           # Entidad User + casos de uso
│       ├── User.ts
│       ├── use-cases/                    # signup, login
│       ├── repositories/                 # UserRepository
│       └── services/                     # SecurityService
├── infrastructure/                   # Capa de infraestructura
│   ├── shared/
│   │   ├── prisma-client.ts              # Singleton PrismaClient
│   │   ├── services/                     # EnvironmentService, BullQueueService, NodemailerEmailService
│   │   └── workers/                      # BullMQ workers
│   ├── book/repositories/              # PrismaBookRepository
│   └── user/
│       ├── repositories/                 # PrismaUserRepository
│       └── services/                     # SecurityServiceImplementation
├── ui/                               # Capa HTTP
│   ├── shared/middlewares/             # Error handler
│   ├── book/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── validators/
│   └── user/
│       ├── controllers/
│       ├── routes/
│       ├── middlewares/               # Authentication middleware
│       └── validators/
├── utils/                            # Utilidades
│   └── seed-utils.ts                   # Seed de base de datos
├── __tests__/                        # Tests de integración
│   └── test-utils/                     # Helpers reutilizables
├── index.ts                          # Punto de entrada
└── api.ts                            # Configuración de Express
```
