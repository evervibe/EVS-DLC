# DLC API Cache System Overview

## Version 0.6.0

The DLC API now includes an intelligent caching system built on Redis to improve performance and reduce database load for frequently accessed data endpoints.

## Architecture

The cache system consists of three main components:

### 1. Redis Module (`src/core/redis/`)

The Redis module provides low-level Redis connectivity and operations:

- **RedisConfig**: Configuration service that reads Redis settings from environment variables
- **RedisService**: Manages Redis connection lifecycle and provides basic operations (get, set, del, keys, count)
- **RedisModule**: NestJS module that exports RedisService globally

Features:
- Auto-reconnect with exponential backoff
- Connection health monitoring
- Error handling and logging
- Configurable via environment variables

### 2. Cache Module (`src/core/cache/`)

The Cache module provides high-level caching functionality:

- **CacheService**: Wraps RedisService with JSON serialization and TTL management
- **DataPreloaderService**: Optional service to preload frequently accessed data on startup
- **CacheModule**: NestJS module that exports CacheService globally

Key Features:
- `wrap()`: Lazy caching wrapper that fetches from cache or executes function
- `get()` / `set()`: Direct cache access with JSON serialization
- `invalidate()`: Remove single cache entry
- `invalidatePattern()`: Remove multiple cache entries by pattern
- Graceful degradation when cache is disabled or unavailable

### 3. Integration with Data Services

All data services (`t_item`, `t_skill`, `t_skilllevel`, `t_string`) now include caching:

- **Read operations**: Cached with configurable TTL (default 120 seconds)
- **Write operations**: Automatically invalidate related cache entries
- **Cache keys**: Structured as `table:operation:params` for easy invalidation

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `USE_CACHE` | Enable/disable caching globally | `false` | No |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` | When cache enabled |
| `CACHE_TTL` | Default TTL in seconds | `120` | No |
| `CACHE_PREFIX` | Key prefix for isolation | `dlc` | No |
| `PRELOAD_ON_START` | Preload data on startup | `false` | No |
| `PRELOAD_TABLES` | Comma-separated table names | `""` | When preload enabled |

### Example Configuration

```env
# Enable caching
USE_CACHE=true
REDIS_URL=redis://localhost:6379
CACHE_TTL=120
CACHE_PREFIX=dlc

# Optional: Preload frequently accessed tables
PRELOAD_ON_START=true
PRELOAD_TABLES=t_item,t_skill,t_skilllevel,t_string
```

## Usage

### In Services

Services automatically use the cache through dependency injection:

```typescript
@Injectable()
export class TItemService {
  constructor(
    @InjectRepository(TItemEntity)
    private readonly repository: Repository<TItemEntity>,
    private readonly cache: CacheService,
  ) {}

  async findAll(limit?: number, offset?: number): Promise<TItemEntity[]> {
    const cacheKey = `t_item:all:${limit || 'all'}:${offset || 0}`;
    return this.cache.wrap(
      cacheKey,
      () => this.repository.find({ take: limit, skip: offset }),
      120
    );
  }

  async create(data: Partial<TItemEntity>): Promise<TItemEntity> {
    const result = await this.repository.save(data);
    await this.cache.invalidatePattern('t_item:*');
    return result;
  }
}
```

### Cache Bypass

The cache can be completely disabled by setting `USE_CACHE=false`. When disabled:
- All cache operations are no-ops
- Services directly query the database
- No Redis connection is established
- Zero performance overhead

## Performance Benefits

- **Reduced Database Load**: Frequent queries served from memory
- **Faster Response Times**: Redis lookups are significantly faster than MySQL queries
- **Scalability**: Cache can be shared across multiple API instances
- **Configurable TTL**: Balance freshness vs. performance per use case

## Monitoring

The `/health` endpoint includes cache metrics:

```json
{
  "status": "ok",
  "version": "0.6.0",
  "databases": { ... },
  "cache": {
    "connected": true,
    "keys": 42
  }
}
```

## Cache Key Structure

Cache keys follow a hierarchical pattern:

```
{prefix}:{table}:{operation}:{params}
```

Examples:
- `dlc:t_item:all:all:0` - All items, no pagination
- `dlc:t_skill:all:10:0` - First 10 skills
- `dlc:t_string:all:all:0` - All strings

This structure allows:
- Easy identification of cached data
- Pattern-based invalidation (`t_item:*`)
- Multi-tenancy support via prefix

## Best Practices

1. **TTL Selection**: Choose TTL based on data volatility
   - Static reference data: 300-600 seconds
   - Frequently updated data: 60-120 seconds

2. **Invalidation**: Always invalidate cache on writes
   - Use pattern invalidation for related data
   - Invalidate before critical reads if needed

3. **Monitoring**: Check cache hit rates in logs
   - Adjust TTL if hit rate is low
   - Consider preloading for frequently accessed data

4. **Development**: Disable cache during development
   - Set `USE_CACHE=false` for immediate feedback
   - Enable only when testing cache behavior

## Troubleshooting

### Cache Not Working

1. Check `USE_CACHE=true` in environment
2. Verify Redis is running and accessible
3. Check logs for connection errors
4. Test Redis connection: `redis-cli ping`

### Stale Data

1. Verify invalidation is called on writes
2. Reduce TTL if data changes frequently
3. Manual invalidation: restart Redis or clear keys

### Performance Issues

1. Check cache hit rate in logs (DEBUG level)
2. Adjust TTL based on hit rate
3. Consider preloading frequently accessed data
4. Monitor Redis memory usage

## Future Enhancements (v0.7.0+)

- Cache hit/miss metrics and reporting
- Advanced cache warming strategies
- Per-endpoint TTL configuration
- Cache eviction policies
- Distributed cache invalidation
