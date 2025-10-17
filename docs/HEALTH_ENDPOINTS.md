# Health Endpoints Documentation

## Overview

The DLC API v0.7.1 provides comprehensive health check endpoints to monitor the status of the application, databases, and cache services.

---

## Endpoints

### 1. Main Health Check

**Endpoint**: `GET /health`

**Description**: Returns overall system health including database and cache status.

**Response**:

```json
{
  "status": "ok",
  "timestamp": "2025-10-17T16:53:01.935Z",
  "version": "0.7.1",
  "databases": {
    "auth": true,
    "game": true,
    "data": true,
    "post": true
  },
  "cache": {
    "connected": false,
    "keys": 0
  }
}
```

**Status Values**:
- `ok`: All databases are healthy
- `degraded`: One or more databases are unavailable

**Example**:

```bash
curl http://localhost:30089/health
```

---

### 2. Readiness Check

**Endpoint**: `GET /health/ready`

**Description**: Returns readiness status of the application.

**Response**:

```json
{
  "status": "ready",
  "timestamp": "2025-10-17T16:53:01.935Z"
}
```

**Example**:

```bash
curl http://localhost:30089/health/ready
```

---

### 3. Redis Health Check

**Endpoint**: `GET /ops/redis`

**Description**: Returns Redis cache connection status and key count.

**Response**:

```json
{
  "status": "ok",
  "timestamp": "2025-10-17T16:53:01.935Z",
  "connected": true,
  "keys": 42
}
```

**Status Values**:
- `ok`: Redis is connected
- `disconnected`: Redis is not available

**Example**:

```bash
curl http://localhost:30089/ops/redis
```

---

### 4. Database Health Check

**Endpoint**: `GET /ops/db`

**Description**: Returns detailed status of all database connections.

**Response**:

```json
{
  "status": "ok",
  "timestamp": "2025-10-17T16:53:01.935Z",
  "databases": {
    "auth": true,
    "game": true,
    "data": true,
    "post": true
  }
}
```

**Status Values**:
- `ok`: All databases are healthy
- `degraded`: One or more databases are unavailable

**Database Keys**:
- `auth`: db_auth database status
- `game`: db_db database status (note: named db_db, not db_game)
- `data`: db_data database status
- `post`: db_post database status

**Example**:

```bash
curl http://localhost:30089/ops/db
```

---

## Frontend Integration

The frontend health check panel uses these endpoints to display system status.

### Environment Variables

```env
VITE_API_HEALTH_URL=http://localhost:30089/health
VITE_REDIS_HEALTH_URL=http://localhost:30089/ops/redis
VITE_DB_HEALTH_URL=http://localhost:30089/ops/db
```

### Implementation Example

```typescript
// Fetch main health status
const healthResponse = await fetch(import.meta.env.VITE_API_HEALTH_URL);
const health = await healthResponse.json();

// Fetch Redis status
const redisResponse = await fetch(import.meta.env.VITE_REDIS_HEALTH_URL);
const redis = await redisResponse.json();

// Fetch database status
const dbResponse = await fetch(import.meta.env.VITE_DB_HEALTH_URL);
const db = await dbResponse.json();
```

---

## Proxy Configuration

The Vite development server is configured to proxy health endpoint requests:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/health': 'http://localhost:30089',
    '/ops': 'http://localhost:30089',
  },
}
```

This allows the frontend to call `/health` and `/ops/*` directly without CORS issues during development.

---

## Monitoring and Alerts

### Using Health Checks for Monitoring

Health endpoints can be used with monitoring tools:

**Docker Healthcheck**:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:30089/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

**Kubernetes Liveness Probe**:
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 30089
  initialDelaySeconds: 30
  periodSeconds: 10
```

**Kubernetes Readiness Probe**:
```yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 30089
  initialDelaySeconds: 5
  periodSeconds: 5
```

---

## Troubleshooting

### Health Check Returns 404

**Cause**: Routes not properly configured

**Solution**:
1. Verify HealthModule is imported in app.module.ts
2. Verify OpsModule is imported in app.module.ts
3. Check that no global prefix is set in main.ts
4. Restart the backend

### Database Status Shows False

**Cause**: Database connection failed

**Solution**:
1. Verify MySQL container is running: `docker ps`
2. Check database credentials in .env
3. Ensure databases exist in MySQL
4. Check backend logs for specific error messages

### Redis Status Shows Disconnected

**Cause**: Redis not running or connection failed

**Solution**:
1. If using cache: Start Redis service
2. If not using cache: This is expected (USE_CACHE=false)
3. Verify REDIS_URL in .env

---

## Best Practices

1. **Regular Monitoring**: Poll `/health` endpoint every 30-60 seconds
2. **Alert on Degraded**: Set up alerts when status changes from "ok" to "degraded"
3. **Log Analysis**: Monitor backend logs for health check errors
4. **Database Checks**: Use `/ops/db` to identify specific database issues
5. **Cache Monitoring**: Use `/ops/redis` to track cache performance

---

## Version History

- **v0.7.1**: Added /ops/redis and /ops/db endpoints, removed /api prefix
- **v0.6.0**: Added cache status to main health endpoint
- **v0.5.0**: Initial health endpoint implementation
