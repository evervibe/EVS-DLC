# Redis Cache Layer - Quick Start Guide

## What's New in v0.6.0

DLC API now includes an intelligent caching system that can reduce database load by 80-95% for read-heavy endpoints while remaining completely optional and backward compatible.

## Quick Start

### Option 1: Without Cache (Default)

No changes needed! The API works exactly as before:

```bash
pnpm dev
```

### Option 2: With Cache (Recommended for Production)

1. **Start Redis:**
   ```bash
   docker run -d --name dlc-redis -p 6379:6379 redis:7-alpine
   ```

2. **Enable cache in `.env`:**
   ```env
   USE_CACHE=true
   REDIS_URL=redis://localhost:6379
   CACHE_TTL=120
   ```

3. **Start API:**
   ```bash
   pnpm dev
   ```

4. **Verify caching:**
   ```bash
   curl http://localhost:4000/health
   ```
   
   Should show:
   ```json
   {
     "status": "ok",
     "version": "0.6.0",
     "cache": {
       "connected": true,
       "keys": 0
     }
   }
   ```

## How It Works

### Cached Endpoints

All data read operations are automatically cached:
- `GET /data/t_item` - Items data (120s TTL)
- `GET /data/t_skill` - Skills data (120s TTL)
- `GET /data/t_skilllevel` - Skill levels (120s TTL)
- `GET /data/t_string` - String resources (120s TTL)

### Cache Invalidation

Write operations automatically invalidate related cache entries:
- `POST /data/t_item` → Clears all `t_item:*` cache
- `PUT /data/t_item/:id` → Clears all `t_item:*` cache
- `DELETE /data/t_item/:id` → Clears all `t_item:*` cache

### Performance Example

**Without Cache:**
```bash
time curl http://localhost:4000/data/t_item
# ~200-500ms (database query)
```

**With Cache (first request):**
```bash
time curl http://localhost:4000/data/t_item
# ~200-500ms (database query + cache write)
```

**With Cache (subsequent requests):**
```bash
time curl http://localhost:4000/data/t_item
# ~10-50ms (Redis cache hit)
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `USE_CACHE` | Enable/disable caching | `false` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `CACHE_TTL` | Default cache TTL (seconds) | `120` |
| `CACHE_PREFIX` | Key prefix for isolation | `dlc` |
| `PRELOAD_ON_START` | Preload data on startup | `false` |
| `PRELOAD_TABLES` | Tables to preload | `""` |

### Production Example

```env
USE_CACHE=true
REDIS_URL=redis://your-redis.cache.amazonaws.com:6379
CACHE_TTL=300
CACHE_PREFIX=dlc-prod
PRELOAD_ON_START=true
PRELOAD_TABLES=t_item,t_skill,t_skilllevel,t_string
```

## Monitoring

### Check Cache Status

```bash
# With jq (install: apt install jq or brew install jq)
curl http://localhost:4000/health | jq '.cache'

# Without jq
curl http://localhost:4000/health
```

### View Cached Keys (Redis CLI)

```bash
redis-cli keys "dlc:*"
redis-cli dbsize
```

### Clear Cache

```bash
# Clear all DLC cache
redis-cli --scan --pattern "dlc:*" | xargs redis-cli del

# Clear specific table
redis-cli --scan --pattern "dlc:t_item:*" | xargs redis-cli del
```

## Troubleshooting

### Cache Not Working

1. Check `USE_CACHE=true` in environment
2. Verify Redis is running: `redis-cli ping`
3. Check API logs for connection errors

### Stale Data

1. Reduce TTL if data changes frequently
2. Clear cache: `redis-cli flushdb`
3. Restart API to reconnect to Redis

### Redis Connection Failed

The API will continue working without cache:
```
[Nest] ERROR [RedisService] Failed to connect to Redis: connect ECONNREFUSED
```

This is normal and non-fatal. The API automatically falls back to direct database queries.

## Documentation

- **Architecture & Usage**: [docs/CACHE_OVERVIEW.md](docs/CACHE_OVERVIEW.md)
- **Setup Guide**: [docs/REDIS_SETUP_GUIDE.md](docs/REDIS_SETUP_GUIDE.md)
- **Implementation Details**: [IMPLEMENTATION_SUMMARY_v0.6.0.md](IMPLEMENTATION_SUMMARY_v0.6.0.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

## Testing

Run tests to verify cache functionality:

```bash
# All tests
pnpm test

# Cache tests only
pnpm test cache.service.spec.ts
```

All tests work without Redis installation and verify graceful degradation.

## Next Steps

- **v0.7.0**: Authentication & RBAC system
- See [docs/ROADMAP_v0.7.0.md](docs/ROADMAP_v0.7.0.md) for details

## Support

For issues or questions:
1. Check the troubleshooting section above
2. See [docs/REDIS_SETUP_GUIDE.md](docs/REDIS_SETUP_GUIDE.md)
3. Review logs for detailed error messages

---

**Status**: ✅ Production Ready (with or without cache)
