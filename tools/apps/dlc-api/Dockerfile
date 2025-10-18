# --- deps ---
FROM node:20-alpine AS deps
RUN corepack enable
WORKDIR /workspace
COPY package.json pnpm-lock.yaml ./
COPY tools/apps/dlc-api/package.json tools/apps/dlc-api/
COPY tools/shared ./tools/shared
RUN pnpm install --frozen-lockfile --filter ./tools/apps/dlc-api...

# --- build ---
FROM node:20-alpine AS build
RUN corepack enable
WORKDIR /workspace
COPY . .
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/tools/apps/dlc-api/node_modules ./tools/apps/dlc-api/node_modules
RUN pnpm --filter ./tools/apps/dlc-api build

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
