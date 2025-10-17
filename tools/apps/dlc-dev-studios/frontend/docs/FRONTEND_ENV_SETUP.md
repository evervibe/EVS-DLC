# DLC Web Admin - Environment Setup Guide

## Version: v0.3.0+env

This guide explains how to configure the DLC Web Admin frontend using environment variables.

## Overview

The DLC Web Admin v0.3.0+env introduces a comprehensive environment configuration system that allows you to customize the application behavior without changing the code. All configuration is centralized in the `/src/core/config/env.ts` module.

## Environment Variables

### Application Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_APP_ENV` | Application environment | - | `development`, `production`, `staging` |
| `VITE_APP_NAME` | Application name | `DLC Web Admin` | `DLC Web Admin` |
| `VITE_APP_VERSION` | Application version | - | `0.3.0+env` |

### API Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_API_URL` | Base API URL | - | `http://localhost:4000/api` |
| `VITE_API_TIMEOUT` | API request timeout (ms) | `8000` | `8000` |
| `VITE_API_HEALTH_URL` | API health check endpoint | - | `http://localhost:4000/health` |
| `VITE_REDIS_HEALTH_URL` | Redis health check endpoint | - | `http://localhost:4000/ops/redis` |
| `VITE_DB_HEALTH_URL` | Database health check endpoint | - | `http://localhost:4000/ops/db` |

### Feature Flags

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_DATA_CACHE` | Enable data caching | `false` | `true`, `false` |
| `VITE_ENABLE_DEBUG_PANEL` | Enable debug panel | `false` | `true`, `false` |
| `VITE_LOG_LEVEL` | Logging level | `info` | `debug`, `info`, `warn`, `error` |

## Setup Instructions

### 1. Create Environment File

Copy the example environment file to create your local configuration:

```bash
cd tools/apps/dlc-dev-studios/frontend
cp .env.example .env
```

### 2. Configure Variables

Edit the `.env` file with your settings:

```bash
# Development Configuration
VITE_APP_ENV=development
VITE_APP_NAME=DLC Web Admin
VITE_APP_VERSION=0.3.0+env

# API Configuration
VITE_API_URL=http://localhost:4000/api
VITE_API_HEALTH_URL=http://localhost:4000/health
VITE_REDIS_HEALTH_URL=http://localhost:4000/ops/redis
VITE_DB_HEALTH_URL=http://localhost:4000/ops/db
VITE_API_TIMEOUT=8000

# Feature Flags
VITE_DATA_CACHE=true
VITE_ENABLE_DEBUG_PANEL=true
VITE_LOG_LEVEL=debug
```

### 3. Environment-Specific Configurations

You can create multiple environment files for different scenarios:

- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.staging` - Staging environment

Vite will automatically load the appropriate file based on the mode:

```bash
# Development (uses .env.development)
pnpm dev

# Production (uses .env.production)
pnpm build

# Staging
pnpm build --mode staging
```

## Usage in Code

The environment configuration is accessed through the centralized `ENV` object:

```typescript
import { ENV } from '@/core/config/env';

// Access configuration
console.log(ENV.APP_NAME);        // "DLC Web Admin"
console.log(ENV.API_URL);         // "http://localhost:4000/api"
console.log(ENV.API_TIMEOUT);     // 8000
console.log(ENV.ENABLE_DEBUG_PANEL); // true
```

## Architecture

### Core Configuration Module

**Location**: `/src/core/config/env.ts`

This module provides:
- Type-safe access to environment variables
- Automatic type conversion (e.g., string to boolean)
- Default values for optional variables
- Single source of truth for configuration

### API Client

**Location**: `/src/core/api/apiClient.ts`

The API client automatically uses environment configuration:
- Base URL from `ENV.API_URL`
- Timeout from `ENV.API_TIMEOUT`
- Error handling with logging

```typescript
import { apiClient } from '@/core/api/apiClient';

// All requests use configured base URL and timeout
const response = await apiClient.get('/data/items');
```

### Health Check System

**Location**: `/src/core/api/health.ts`

The health check system monitors:
- API Server (`ENV.API_HEALTH_URL`)
- Redis Cache (`ENV.REDIS_HEALTH_URL`)
- Database (`ENV.DB_HEALTH_URL`)

Access via the Health Monitor page at `/health`.

## Best Practices

### 1. Never Commit Secrets

- Never commit `.env` files with sensitive data
- Use `.env.example` as a template
- Add `.env` to `.gitignore`

### 2. Environment-Specific URLs

Configure different URLs for each environment:

```bash
# Development
VITE_API_URL=http://localhost:4000/api

# Production
VITE_API_URL=https://api.production.com/api

# Staging
VITE_API_URL=https://api.staging.com/api
```

### 3. Type Safety

Always use the `ENV` object instead of `import.meta.env` directly:

```typescript
// ✅ Good
import { ENV } from '@/core/config/env';
const apiUrl = ENV.API_URL;

// ❌ Bad
const apiUrl = import.meta.env.VITE_API_URL;
```

### 4. Feature Flags

Use feature flags to control functionality:

```typescript
import { ENV } from '@/core/config/env';

if (ENV.ENABLE_DEBUG_PANEL) {
  // Show debug panel
}

if (ENV.DATA_CACHE) {
  // Enable caching
}
```

## Troubleshooting

### Environment Variables Not Loading

1. **Check file name**: Must be `.env` (with dot prefix)
2. **Restart dev server**: Changes require restart
3. **Check prefix**: All variables must start with `VITE_`
4. **Verify location**: File must be in project root

### TypeScript Errors

If you add new environment variables, update:

1. `/src/core/config/env.ts` - Add to ENV object
2. `/src/vite-env.d.ts` - Add type declaration (if needed)

### Health Checks Failing

Ensure the backend endpoints are available:

```bash
# Test endpoints manually
curl http://localhost:4000/health
curl http://localhost:4000/ops/redis
curl http://localhost:4000/ops/db
```

## Migration from v0.0.1

If upgrading from v0.0.1-alpha:

1. Update `.env.example` with new variables
2. Update imports from `@/api/client` to `@/core/api/apiClient`
3. Replace `import.meta.env.VITE_*` with `ENV.*`
4. Test health monitoring functionality

## Next Steps

After configuring the environment:

1. Start the development server: `pnpm dev`
2. Visit Health Monitor: `http://localhost:5173/health`
3. Verify all services are online
4. Configure additional settings in Settings page

## Support

For issues or questions:
- Check the [CHANGELOG.md](./CHANGELOG.md)
- Review [FRONTEND_STRUCTURE_OVERVIEW.md](./FRONTEND_STRUCTURE_OVERVIEW.md)
- Check the API documentation in [API_BINDINGS.md](./API_BINDINGS.md)
