# 1) Dependencias (instala con package-lock)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Build (usa deps + código fuente)
FROM node:20-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Si no lo tienes ya, en next.config.ts usa:  export default { output: 'standalone' }
RUN npm run build

# 3) Runtime mínimo (standalone)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Usuario no root (más seguro)
USER node

# Copiamos el runtime standalone que genera Next
COPY --chown=node:node --from=build /app/.next/standalone ./
COPY --chown=node:node --from=build /app/.next/static ./.next/static
COPY --chown=node:node --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]