# Backend Boot Flow Documentation

## Overview

This document details the bootstrap process and module initialization order for the DLC API backend (NestJS + Fastify + TypeORM).

**Version:** 0.5.1  
**Last Updated:** 2025-10-17

---

## Boot Sequence Overview

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Entry Point                                               │
│    src/main.ts → bootstrap()                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Environment Loading                                       │
│    - Load .env file via dotenv                               │
│    - Parse with src/config/env.ts                            │
│    - Validate with Joi schema in app.module.ts               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Database Connection Test                                  │
│    - Test all 4 database connections                         │
│    - Log results (success or warning)                        │
│    - Continue even if databases unavailable                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. NestJS Application Creation                               │
│    - Create app with FastifyAdapter                          │
│    - Load AppModule and all sub-modules                      │
│    - Initialize dependency injection                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. CORS Configuration                                        │
│    - Enable CORS for all origins                             │
│    - Allow credentials                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Start Server                                              │
│    - Listen on 0.0.0.0:30089                                 │
│    - Log startup messages                                    │
│    - Display health check URL                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Boot Flow

### Step 1: Entry Point

**File:** `src/main.ts`

```typescript
async function bootstrap() {
  console.log('🚀 Starting DLC API v0.5.1...');
  // ... boot sequence
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
```

**Purpose:**
- Entry point for the application
- Wraps entire boot process in error handling
- Exits with code 1 on failure for container orchestration

### Step 2: Environment Configuration

**Files:**
- `.env` (optional, uses defaults if missing)
- `src/config/env.ts`
- `src/app.module.ts`

**Process:**

1. **Load .env file:**
```typescript
// env.ts
dotenv.config({ path: path.join(__dirname, '../../.env') });
```

2. **Parse environment variables:**
```typescript
export const env: EnvConfig = {
  apiPort: getEnvNumber('API_PORT', 30089),
  nodeEnv: getEnvValue('NODE_ENV', 'development'),
  // ... database configs
};
```

3. **Validate with Joi schema:**
```typescript
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: Joi.object({
    API_PORT: Joi.number().default(30089),
    NODE_ENV: Joi.string().default('development'),
    // ... all required variables
  }),
})
```

**Key Features:**
- All variables have sensible defaults
- No .env file required for development
- Validation runs before app creation
- Failed validation stops startup with clear error

### Step 3: Database Connection Test

**File:** `src/main.ts`

```typescript
try {
  console.log('📊 Testing database connections...');
  await testDbConnections();
  console.log('✅ All database connections successful');
} catch (error) {
  console.warn('⚠️  Database connection test failed:', error.message);
  console.warn('⚠️  API will start but database operations may fail.');
  console.warn('💡 Make sure Docker containers are running: cd infra/DB/game && docker compose up -d');
}
```

**Purpose:**
- Verify database connectivity early
- Provide helpful error messages
- Don't block startup (graceful degradation)
- Guide developers to solution

**What's Tested:**
```typescript
// src/common/db/test-connections.ts
export async function testDbConnections(): Promise<void> {
  for (const [name, pool] of Object.entries(dbPools)) {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
  }
}
```

### Step 4: NestJS Application Creation

**File:** `src/main.ts`

```typescript
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({
    logger: false,
  }),
);
```

**Process:**

1. **Create Fastify adapter:**
   - HTTP server implementation
   - Faster than Express
   - Better performance for APIs

2. **Load AppModule:**
   - Imports all feature modules
   - Sets up dependency injection
   - Configures global filters and pipes

3. **Module loading order:**
```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule,      // 1. Configuration (must be first)
    AuthModule,        // 2. Auth database module
    GameModule,        // 3. Game database module
    DataModule,        // 4. Data database module
    PostModule,        // 5. Post database module
    HealthModule,      // 6. Health monitoring
  ],
})
```

### Step 5: CORS Configuration

**File:** `src/main.ts`

```typescript
app.enableCors({
  origin: true,
  credentials: true,
});
```

**Configuration:**
- `origin: true` - Accept requests from any origin (development)
- `credentials: true` - Allow cookies and authentication headers

**Production Considerations:**
```typescript
// For production, restrict origins:
app.enableCors({
  origin: ['https://yourdomain.com'],
  credentials: true,
});
```

### Step 6: Server Start

**File:** `src/main.ts`

```typescript
await app.listen(env.apiPort, '0.0.0.0');

console.log('');
console.log('✅ DLC API läuft auf Port', env.apiPort);
console.log('✅ Environment:', env.nodeEnv);
console.log('✅ Fastify adapter enabled');
console.log('✅ CORS enabled');
console.log('');
console.log('📍 Health Check: http://localhost:' + env.apiPort + '/health');
console.log('📍 API Base: http://localhost:' + env.apiPort);
console.log('');
```

**Important:**
- Binds to `0.0.0.0` (all interfaces) for Docker compatibility
- Logs startup summary for developer feedback
- Displays useful URLs for testing

---

## Module Initialization

### Module Loading Order

Modules are loaded in this order:

#### 1. ConfigModule (Global)

**Purpose:** Provide configuration to all other modules

**Features:**
- Global scope (available everywhere)
- Environment variable validation
- Type-safe configuration access

**Usage in other modules:**
```typescript
constructor(private configService: ConfigService) {
  const port = this.configService.get('API_PORT');
}
```

#### 2. AuthModule

**Database:** `db_auth`

**Entities:**
- User-related entities (future)
- Authentication data

**Status:** Prepared for future authentication implementation

#### 3. GameModule

**Database:** `db_db` (legacy naming)

**Entities:**
- Game content
- Player data
- World data

**Status:** Active, used for game-related data

#### 4. DataModule

**Database:** `db_data`

**Entities:**
- Items (weapons, armor, consumables)
- Skills (abilities, spells)
- SkillLevels (progression data)
- Strings (localization)

**Status:** Primary data module for DLC content

**Configuration:**
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'mysql',
    host: config.get('DB_DATA_HOST'),
    port: config.get('DB_DATA_PORT'),
    username: config.get('DB_DATA_USER'),
    password: config.get('DB_DATA_PASS'),
    database: config.get('DB_DATA_NAME'),
    entities: [Item, Skill, SkillLevel, String],
    synchronize: false,
    retryAttempts: 3,
    retryDelay: 3000,
  }),
})
```

#### 5. PostModule

**Database:** `db_post`

**Entities:**
- Post-related data (future)

**Status:** Prepared for future features

#### 6. HealthModule

**Purpose:** Health monitoring endpoints

**Routes:**
- `GET /health` - Full health check with database status
- `GET /health/ready` - Simple readiness probe

**Status:** Active and essential for monitoring

---

## Global Providers

### Exception Filter

**File:** `src/common/errors/global-exception.filter.ts`

**Purpose:**
- Catch all unhandled exceptions
- Format error responses consistently
- Log errors for debugging

**Configuration:**
```typescript
{
  provide: APP_FILTER,
  useClass: GlobalExceptionFilter,
}
```

### Validation Pipe

**File:** `src/common/middleware/validation.pipe.ts`

**Purpose:**
- Validate request DTOs
- Transform input data
- Return clear validation errors

**Configuration:**
```typescript
{
  provide: APP_PIPE,
  useValue: validationPipe,
}
```

---

## Database Connection Pools

### Pool Creation

**File:** `src/common/db/pools.ts`

```typescript
export const dbPools = {
  auth: createPool(env.dbAuth),
  game: createPool(env.dbGame),
  data: createPool(env.dbData),
  post: createPool(env.dbPost),
};
```

### Pool Configuration

```typescript
function createPool(config: DatabaseConfig) {
  return mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}
```

### TypeORM vs Raw Pools

**TypeORM:**
- Used in feature modules
- Provides entity mapping
- Transaction support
- Repository pattern

**Raw Pools:**
- Used in health checks
- Direct SQL access
- Lower overhead
- Simple connectivity tests

---

## Boot Failure Scenarios

### Scenario 1: Invalid Environment Variables

**Error:**
```
ValidationError: "API_PORT" must be a number
```

**Cause:**
- Invalid value in .env file
- Joi validation failed

**Solution:**
- Fix .env value
- Or remove variable to use default

### Scenario 2: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use 0.0.0.0:30089
```

**Cause:**
- Another process using port 30089
- Previous instance didn't shut down

**Solution:**
```bash
# Find process using port
lsof -i :30089

# Kill process
kill -9 <PID>

# Or change port in .env
API_PORT=30090
```

### Scenario 3: Database Connection Failure

**Warning (non-fatal):**
```
⚠️  Database connection test failed: connect ECONNREFUSED
⚠️  API will start but database operations may fail.
```

**Cause:**
- Docker containers not running
- Wrong credentials
- Network issues

**Solution:**
```bash
cd infra/DB/game
docker compose up -d
```

**Important:** App still starts, allowing health endpoint to be checked

### Scenario 4: Module Import Error

**Error:**
```
Error: Cannot find module '@nestjs/typeorm'
```

**Cause:**
- Missing dependencies
- npm/pnpm install not run

**Solution:**
```bash
cd tools/apps/dlc-api
pnpm install
```

---

## Startup Logs Explained

### Successful Startup

```
🚀 Starting DLC API v0.5.1...
📊 Testing database connections...
✅ All database connections successful

✅ DLC API läuft auf Port 30089
✅ Environment: development
✅ Fastify adapter enabled
✅ CORS enabled

📍 Health Check: http://localhost:30089/health
📍 API Base: http://localhost:30089
```

**Indicators:**
- ✅ All emojis green checks
- Database test passed
- Server listening
- URLs displayed

### Degraded Startup (DB unavailable)

```
🚀 Starting DLC API v0.5.1...
📊 Testing database connections...
⚠️  Database connection test failed: connect ECONNREFUSED
⚠️  API will start but database operations may fail.
💡 Make sure Docker containers are running: cd infra/DB/game && docker compose up -d

✅ DLC API läuft auf Port 30089
✅ Environment: development
✅ Fastify adapter enabled
✅ CORS enabled

📍 Health Check: http://localhost:30089/health
📍 API Base: http://localhost:30089
```

**Indicators:**
- ⚠️ Warning symbols
- Helpful guidance provided
- API still starts
- Health endpoint available for diagnosis

---

## Development vs Production

### Development Mode

**Characteristics:**
- Detailed logging
- CORS accepts all origins
- Database connection warnings (non-fatal)
- Source maps enabled
- Hot reload (via ts-node-dev)

**Start Command:**
```bash
pnpm dev
```

**Process:**
```bash
ts-node-dev --respawn --transpile-only src/main.ts
```

### Production Mode

**Characteristics:**
- Minimal logging
- CORS restricted to specific origins
- Database failures block startup
- Compiled TypeScript
- Process manager (PM2, systemd)

**Start Command:**
```bash
pnpm build
pnpm start:prod
```

**Process:**
```bash
tsc                 # Compile TypeScript
node dist/main.js   # Run compiled JavaScript
```

---

## Debugging Boot Issues

### Enable Verbose Logging

**Add to bootstrap():**
```typescript
console.log('Environment variables:', process.env);
console.log('Parsed config:', env);
```

### Test Individual Components

**Database connections:**
```bash
cd tools/apps/dlc-api
pnpm run introspect
```

**TypeScript compilation:**
```bash
pnpm build
```

**Configuration validation:**
```bash
# Invalid port
API_PORT=abc pnpm dev
# Should show Joi validation error
```

### Common Debug Points

1. **Check .env loading:**
```typescript
// Add to env.ts
console.log('Loading .env from:', path.join(__dirname, '../../.env'));
```

2. **Check module imports:**
```typescript
// Add to app.module.ts
console.log('Loading AppModule...');
```

3. **Check database pools:**
```typescript
// Add to pools.ts
console.log('Creating pool for:', config.database);
```

---

## Best Practices

### 1. Error Handling

**Do:**
- Wrap async operations in try-catch
- Provide helpful error messages
- Log errors with context
- Exit with appropriate code

**Don't:**
- Swallow errors silently
- Use generic error messages
- Block startup for non-critical failures

### 2. Configuration

**Do:**
- Provide sensible defaults
- Validate all config values
- Document required variables
- Use type-safe config

**Don't:**
- Require .env for development
- Use hardcoded values
- Skip validation

### 3. Logging

**Do:**
- Log important milestones
- Use consistent format
- Include helpful context
- Show URLs for testing

**Don't:**
- Log sensitive data
- Over-log in production
- Use unclear messages

---

## Quick Reference

### Key Files

| File | Purpose |
|------|---------|
| `src/main.ts` | Bootstrap and startup |
| `src/app.module.ts` | Module configuration |
| `src/config/env.ts` | Environment parsing |
| `src/common/db/pools.ts` | Database pools |
| `src/common/db/test-connections.ts` | Connection testing |

### Startup Commands

```bash
# Development
cd tools/apps/dlc-api
pnpm dev

# Production
pnpm build
pnpm start:prod

# With custom env file
ENV_FILE=.env.production pnpm dev
```

### Port Configuration

```bash
# Default
API_PORT=30089

# Custom
API_PORT=8080
```

---

## Next Steps

For more information:
- [System Health Check Guide](./SYSTEM_HEALTH_CHECK.md)
- [Frontend ENV Sync Guide](./FRONTEND_ENV_SYNC_GUIDE.md)
- [Infrastructure Status Report](./INFRA_STATUS_REPORT_v0.5.1.md)
