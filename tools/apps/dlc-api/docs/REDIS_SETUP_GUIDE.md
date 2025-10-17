# Redis Setup Guide for DLC API

This guide covers Redis installation and configuration for the DLC API cache system.

## Quick Start

### Using Docker (Recommended)

The easiest way to run Redis locally:

```bash
docker run -d \
  --name dlc-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### Using Docker Compose

Add Redis to your `docker-compose.yml`:

```yaml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    container_name: dlc-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped

volumes:
  redis-data:
```

Start Redis:

```bash
docker-compose up -d redis
```

## Installation Methods

### macOS (Homebrew)

```bash
# Install Redis
brew install redis

# Start Redis service
brew services start redis

# Or run Redis in foreground
redis-server
```

### Ubuntu/Debian

```bash
# Install Redis
sudo apt update
sudo apt install redis-server

# Start Redis service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Check status
sudo systemctl status redis-server
```

### Windows

Use Docker Desktop or WSL2 with Ubuntu instructions above.

Alternatively, download Redis for Windows from:
https://github.com/microsoftarchive/redis/releases

## Configuration

### DLC API Configuration

Update your `.env` file:

```env
# Enable caching
USE_CACHE=true

# Redis connection URL
REDIS_URL=redis://localhost:6379

# Cache settings
CACHE_TTL=120
CACHE_PREFIX=dlc

# Optional: Preload data on startup
PRELOAD_ON_START=false
PRELOAD_TABLES=t_item,t_skill,t_skilllevel,t_string
```

### Redis Connection URLs

Format: `redis://[username][:password]@host:port[/database]`

Examples:

```env
# Local Redis (default)
REDIS_URL=redis://localhost:6379

# With password
REDIS_URL=redis://:mypassword@localhost:6379

# Specific database (0-15)
REDIS_URL=redis://localhost:6379/1

# Remote Redis
REDIS_URL=redis://redis.example.com:6379

# Redis Cluster
REDIS_URL=redis://node1:6379,node2:6379,node3:6379
```

### Redis Server Configuration (Optional)

For production, create `/etc/redis/redis.conf`:

```conf
# Bind to specific interface
bind 127.0.0.1

# Set password
requirepass your_redis_password

# Persistence
save 900 1
save 300 10
save 60 10000

# Max memory policy
maxmemory 256mb
maxmemory-policy allkeys-lru

# Append-only file
appendonly yes
appendfsync everysec
```

Restart Redis after configuration changes:

```bash
sudo systemctl restart redis-server
```

## Verification

### Test Redis Connection

```bash
# Using redis-cli
redis-cli ping
# Expected output: PONG

# Check server info
redis-cli info server

# Monitor commands in real-time
redis-cli monitor
```

### Test DLC API Cache

1. Start the API with caching enabled:
   ```bash
   USE_CACHE=true pnpm dev
   ```

2. Check logs for Redis connection:
   ```
   ✅ Redis connected on redis://localhost:6379
   ```

3. Test health endpoint:
   ```bash
   curl http://localhost:4000/health
   ```
   
   Expected output:
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

4. Test caching behavior:
   ```bash
   # First request (cache miss)
   time curl http://localhost:4000/data/t_item
   
   # Second request (cache hit - should be faster)
   time curl http://localhost:4000/data/t_item
   ```

## Monitoring

### View Cached Keys

```bash
# List all DLC cache keys
redis-cli keys "dlc:*"

# Count cached keys
redis-cli dbsize

# Get specific key
redis-cli get "dlc:t_item:all:all:0"
```

### Memory Usage

```bash
# Memory info
redis-cli info memory

# Memory usage per key pattern
redis-cli --bigkeys
```

### Clear Cache

```bash
# Clear all DLC cache keys
redis-cli --scan --pattern "dlc:*" | xargs redis-cli del

# Clear entire database (use with caution!)
redis-cli flushdb
```

## Production Deployment

### AWS ElastiCache

1. Create ElastiCache Redis cluster
2. Note the endpoint URL
3. Update `.env`:
   ```env
   REDIS_URL=redis://your-cluster.cache.amazonaws.com:6379
   ```

### Azure Cache for Redis

1. Create Azure Cache instance
2. Get connection string from portal
3. Update `.env`:
   ```env
   REDIS_URL=redis://:your-password@your-cache.redis.cache.windows.net:6380
   ```

### Redis Cloud

1. Sign up at https://redis.com/try-free/
2. Create database
3. Copy connection URL
4. Update `.env`:
   ```env
   REDIS_URL=redis://default:password@endpoint:port
   ```

## Security

### Enable Authentication

In Redis config:
```conf
requirepass your_strong_password
```

In DLC API:
```env
REDIS_URL=redis://:your_strong_password@localhost:6379
```

### Firewall Rules

Only allow API servers to connect:

```bash
# iptables example
sudo iptables -A INPUT -p tcp --dport 6379 -s 10.0.0.0/24 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 6379 -j DROP
```

### TLS/SSL (Production)

1. Generate certificates
2. Configure Redis with TLS
3. Update connection URL:
   ```env
   REDIS_URL=rediss://localhost:6380
   ```

## Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solutions:**
- Check Redis is running: `redis-cli ping`
- Verify port 6379 is open
- Check bind address in redis.conf

### Authentication Failed

```
Error: NOAUTH Authentication required
```

**Solutions:**
- Include password in URL: `redis://:password@host:6379`
- Or remove requirepass from redis.conf

### Out of Memory

```
Error: OOM command not allowed when used memory > 'maxmemory'
```

**Solutions:**
- Increase maxmemory in redis.conf
- Enable eviction policy: `maxmemory-policy allkeys-lru`
- Clear old cache: `redis-cli flushdb`

### Slow Performance

**Check:**
- Redis is on same network as API
- Redis memory isn't full
- Disk I/O isn't bottleneck (use `appendfsync no` for testing)

**Monitor:**
```bash
redis-cli --latency
redis-cli --latency-history
```

## Best Practices

1. **Development**: Use Docker for consistency
2. **Staging**: Use managed service (ElastiCache, Azure Cache, etc.)
3. **Production**: 
   - Use managed Redis with automatic backups
   - Enable persistence (AOF + RDB)
   - Monitor memory usage
   - Set up alerts for connection failures
4. **Security**:
   - Always use password in production
   - Never expose Redis port publicly
   - Use TLS for remote connections

## Additional Resources

- [Redis Documentation](https://redis.io/documentation)
- [Redis Best Practices](https://redis.io/docs/management/optimization/)
- [ioredis Documentation](https://github.com/redis/ioredis)
- [Redis Commands Reference](https://redis.io/commands)
