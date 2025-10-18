# --- deps ---
FROM node:20-alpine AS deps
# Install pnpm (use corepack in CI, or install via npm)
RUN corepack enable || npm config set strict-ssl false && npm install -g pnpm@9.12.3
WORKDIR /workspace
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tools/apps/dlc-api/package.json tools/apps/dlc-api/
COPY tools/shared/lib/package.json tools/shared/lib/
COPY tools/shared/ui/package.json tools/shared/ui/
RUN pnpm install --frozen-lockfile --filter dlc-api...

# --- build ---
FROM node:20-alpine AS build
RUN corepack enable || npm config set strict-ssl false && npm install -g pnpm@9.12.3
WORKDIR /workspace
COPY . .
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/tools/apps/dlc-api/node_modules ./tools/apps/dlc-api/node_modules
RUN pnpm --filter dlc-api build

# --- runtime ---
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /workspace/tools/apps/dlc-api/dist ./dist
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/tools/apps/dlc-api/node_modules ./node_modules
COPY tools/apps/dlc-api/package.json .
CMD ["node", "dist/main.js"]
EXPOSE 30089
