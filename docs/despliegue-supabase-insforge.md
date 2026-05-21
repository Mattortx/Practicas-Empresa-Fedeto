# Despliegue con Supabase + InsForge

> Stack open source: Supabase (PostgreSQL) + InsForge Cloud (frontend + backend)

## Arquitectura

```text
Usuario web
  → InsForge Site Deployment (Vercel CDN)
    → Frontend Vite compilado (React 18)
      → API Calls al backend
        → InsForge Compute (Fly.io container)
          → Backend Node.js (server/index.js)
            → Supabase PostgreSQL
              → Tablas: leads, conversation_events
```

## Prerrequisitos

- Cuenta en [Supabase](https://supabase.com) (free tier)
- Cuenta en [InsForge Cloud](https://insforge.dev) (free tier)
- Docker instalado (para build local)
- Node.js 20+

## Paso 1: Supabase — Base de datos

### 1.1 Crear proyecto

1. Ir a [Supabase Dashboard](https://supabase.com/dashboard) → New project
2. Elegir nombre y región (la más cercana)
3. Guardar la **Database Password**
4. Esperar a que se cree la base de datos (~2 min)

### 1.2 Obtener credenciales

Ir a **Project Settings → API**:

| Variable | Valor |
|---|---|
| `SUPABASE_URL` | `https://tu-proyecto.supabase.co` (Project URL) |
| `SUPABASE_SERVICE_KEY` | `service_role` key (NO la anon key) |

### 1.3 Ejecutar migraciones

Ir a **SQL Editor** en Supabase, pegar el contenido de `server/db/migrations.sql` y ejecutar.

Esto crea las tablas `leads` y `conversation_events` con índices y triggers.

## Paso 2: InsForge — Configuración del proyecto

### 2.1 Crear proyecto en InsForge

```bash
npx @insforge/cli login
npx @insforge/cli project create --name protecciones-toledo
npx @insforge/cli link --project-id <project-id>
```

### 2.2 Configurar variables de entorno

```bash
npx @insforge/cli env set SUPABASE_URL https://tu-proyecto.supabase.co
npx @insforge/cli env set SUPABASE_SERVICE_KEY tu_service_role_key
npx @insforge/cli env set AI_PROVIDER groq
npx @insforge/cli env set GROQ_API_KEY tu_clave_groq
npx @insforge/cli env set AI_ENABLED true
npx @insforge/cli env set PUBLIC_APP_URL https://tu-app.insforge.site
```

## Paso 3: Deploy del backend (Compute Services)

### 3.1 Buildear imagen Docker

```bash
docker build -t protecciones-api .
docker tag protecciones-api ghcr.io/tu-usuario/protecciones-api:latest
docker push ghcr.io/tu-usuario/protecciones-api:latest
```

### 3.2 Deploy en InsForge Compute

```bash
npx @insforge/cli compute deploy \
  --name protecciones-api \
  --image ghcr.io/tu-usuario/protecciones-api:latest \
  --port 8787 \
  --memory 256
```

Esto devuelve una URL tipo: `https://protecciones-api-abc123.fly.dev`

### 3.3 Verificar health

```bash
curl https://protecciones-api-abc123.fly.dev/health
# → { "ok": true, "aiEnabled": true, ... }
curl https://protecciones-api-abc123.fly.dev/api/health/db
# → { "ok": true, "connected": true }
```

## Paso 4: Deploy del frontend (Site Deployment)

### 4.1 Build del frontend

```bash
npm run build
# genera dist/
```

### 4.2 Configurar env vars de build

```bash
npx @insforge/cli deployments env set VITE_API_URL https://protecciones-api-abc123.fly.dev
```

### 4.3 Deploy

```bash
npx @insforge/cli deployments deploy ./dist
```

Esto devuelve una URL tipo: `https://protecciones-toledo.insforge.site`

### 4.4 Verificar

```text
https://protecciones-toledo.insforge.site/
https://protecciones-toledo.insforge.site/admin-demo
```

## Paso 5: CI/CD automático

El workflow `.github/workflows/deploy.yml` ya está configurado para:

1. Hacer typecheck y tests en cada push a `main`
2. Buildear la imagen Docker
3. Pushearla a GitHub Container Registry (`ghcr.io`)

Para que funcione el auto-deploy en InsForge, conectá el repo en el dashboard de InsForge o ejecutá manualmente:

```bash
npx @insforge/cli compute deploy \
  --name protecciones-api \
  --image ghcr.io/tu-usuario/protecciones-api:latest \
  --port 8787
```

## Costos estimados

| Recurso | Costo |
|---|---|
| Supabase Free Tier | $0/mes (500MB BD, 2M requests) |
| InsForge Cloud Free | $0/mes |
| InsForge Compute (Fly.io) | ~$2/mes (shared-1x, 256MB) |
| GitHub Container Registry | $0 (público) |
| **Total** | **~$2/mes** |

## Estructura de archivos añadida

```text
server/db/
  supabase.js        ← Cliente Supabase
  migrations.sql     ← Esquema de base de datos
  routes.js          ← Endpoints CRUD /api/leads y /api/events
src/services/
  leadApi.ts         ← Cliente frontend para la API
Dockerfile           ← Build multi-stage (imagen ~120MB)
.dockerignore        ← Excluye node_modules, .env, etc.
vercel.json          ← SPA rewrites para frontend
.github/workflows/
  deploy.yml         ← CI/CD: build + push a GHCR
docs/
  despliegue-supabase-insforge.md  ← Esta guía
```

## Desarrollo local

Para desarrollo, el backend funciona con o sin Supabase:

```bash
# Sin BD (modo legacy, localStorage)
npm run dev:full

# Con BD (si SUPABASE_URL y SUPABASE_SERVICE_KEY están en .env.local)
npm run dev:api
```

Si la BD no está configurada, el frontend vuelve automáticamente a `localStorage` como fallback — no se pierde funcionalidad.
