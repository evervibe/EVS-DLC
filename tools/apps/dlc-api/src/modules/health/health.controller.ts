import { Controller, Get } from '@nestjs/common';
import { dbPools } from '../../common/db';
import { RedisService } from '../../core/redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(private readonly redisService: RedisService) {}

  @Get()
  async getStatus() {
    const dbStatus = {
      auth: false,
      game: false,
      data: false,
      post: false,
    };

    // Test each database connection
    for (const [name, pool] of Object.entries(dbPools)) {
      try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        dbStatus[name as keyof typeof dbStatus] = true;
      } catch (error) {
        console.error(`Health check failed for ${name} database:`, error.message);
      }
    }

    const allDbsHealthy = Object.values(dbStatus).every(status => status);
    
    // Get cache status
    const cacheStatus = {
      connected: this.redisService.isConnected(),
      keys: await this.redisService.count(),
    };

    return {
      status: allDbsHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '0.8.2',
      databases: dbStatus,
      cache: cacheStatus,
    };
  }

  @Get('ready')
  getReadiness() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }
}

