# ── Build stage ──────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json vite.config.ts vitest.config.ts ./
COPY index.html ./
COPY src/ src/

RUN npm run build

# ── Production stage ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Solo copiar lo necesario para producción
COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev

COPY --from=builder /app/dist ./dist
COPY server/ server/

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:8787/health || exit 1

CMD ["node", "server/index.js"]
