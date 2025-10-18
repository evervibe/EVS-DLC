# --- deps ---
FROM node:20-alpine AS deps
RUN corepack enable
WORKDIR /workspace
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tools/apps/dlc-web-admin/package.json tools/apps/dlc-web-admin/
COPY tools/shared/lib/package.json tools/shared/lib/
COPY tools/shared/ui/package.json tools/shared/ui/
RUN pnpm install --frozen-lockfile --filter dlc-web-admin...

# --- build ---
FROM node:20-alpine AS build
RUN corepack enable
WORKDIR /workspace
COPY . .
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/tools/apps/dlc-web-admin/node_modules ./tools/apps/dlc-web-admin/node_modules
ENV NODE_ENV=production
RUN pnpm --filter dlc-web-admin... build

# --- runtime ---
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /workspace/tools/apps/dlc-web-admin/.next ./.next
COPY --from=build /workspace/tools/apps/dlc-web-admin/public ./public
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/tools/apps/dlc-web-admin/node_modules ./node_modules
COPY tools/apps/dlc-web-admin/package.json .
COPY tools/apps/dlc-web-admin/next.config.mjs .
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "5174"]
EXPOSE 5174
