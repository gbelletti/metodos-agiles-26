# CLAUDE.md — metodos-agiles-26

Guía para agentes IA trabajando en este repositorio.

## Estructura del proyecto

```
metodos-agiles-26/
├── frontend/   # Next.js 15 + TypeScript + Tailwind CSS + App Router
└── backend/    # Spring Boot 3.4.5 + Maven + JPA + PostgreSQL (Neon) + Lombok
```

---

## Frontend (`/frontend`)

**Stack:** Next.js 15, TypeScript, Tailwind CSS, App Router, `src/` layout
**Package manager:** npm
**Puerto de desarrollo:** 3000

### Comandos

```bash
cd frontend
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo
npm run build     # build de producción
npm run lint      # ESLint
```

### Variables de entorno

El archivo `.env.local` **no se commitea**. Pedírselo a un integrante del grupo y pegarlo en `frontend/`.


| Variable              | Descripción          | Default                     |
|-----------------------|----------------------|-----------------------------|
| `NEXT_PUBLIC_API_URL` | URL base del backend | `http://localhost:8080/api` |

### Convenciones

- Componentes en `src/app/` siguiendo App Router (layouts, pages, loading, error).
- Componentes reutilizables en `src/components/`.
- Lógica de llamadas HTTP en `src/lib/` o `src/services/`.
- Tipado estricto — no usar `any`.

---

## Backend (`/backend`)

**Stack:** Spring Boot 3.4.5, Java 21, Maven, Spring Data JPA, PostgreSQL (Neon), Lombok, Validation
**Puerto:** 8080
**Package base:** `com.agile.backend`

### Setup inicial al clonar

```bash
cd backend
# Pedirle el .env a un integrante del grupo y pegarlo acá como backend/.env
```

Spring Boot lee el `.env` automáticamente gracias a esta línea en `application.properties`:

```properties
spring.config.import=file:.env[.properties]
```

No hace falta ningún script ni dependencia extra. Si el `.env` no existe, la app no arranca.

### Comandos

```bash
mvn spring-boot:run    # levantar el backend
mvn clean package      # compilar JAR
mvn test               # correr tests
```

### Variables de entorno

| Variable                     | Descripción                                    |
|------------------------------|------------------------------------------------|
| `SPRING_DATASOURCE_URL`      | JDBC URL de Neon (incluye `sslmode=require`)   |
| `SPRING_DATASOURCE_USERNAME` | Usuario de Neon (`neondb_owner`)               |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña — ver en Neon      |

Formato del `.env`:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-xxx-pooler.sa-east-1.aws.neon.tech/m-agile-26?sslmode=require&channel_binding=require
SPRING_DATASOURCE_USERNAME=neondb_owner
SPRING_DATASOURCE_PASSWORD=contraseña_real
```

### Convenciones

- Estructura de paquetes por capa: `controller`, `service`, `repository`, `model`, `dto`.
- Todos los endpoints bajo `/api/**` (configurado en `CorsConfig.java`).
- Usar `@Valid` + DTOs para entrada; nunca exponer entidades directamente.
- Lombok activo: preferir `@Data`, `@Builder`, `@RequiredArgsConstructor`.

---

## CORS

El backend acepta requests de `http://localhost:3000` sobre `/api/**`.
Configurado en `backend/src/main/java/com/agile/backend/CorsConfig.java`.

---

## Git

- Rama principal: `main`
- **Nunca commitear:** `node_modules/`, `target/`, `.env`, `.env.local`
- Lo que SÍ se commitea: `application.properties`, `.env.example`, `.env.local.example`
- Mensajes de commit formato `tipo: descripción` (ej: `feat: agregar endpoint de usuarios`)
