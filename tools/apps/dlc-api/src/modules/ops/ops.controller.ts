import { Controller, Get } from '@nestjs/common';
import { dbPools } from '../../common/db';
import { RedisService } from '../../core/redis/redis.service';

@Controller('ops')
export class OpsController {
  constructor(private readonly redisService: RedisService) {}

  @Get('redis')
  async getRedisStatus() {
    const isConnected = this.redisService.isConnected();
    const keyCount = await this.redisService.count();

    return {
      status: isConnected ? 'ok' : 'disconnected',
      timestamp: new Date().toISOString(),
      connected: isConnected,
      keys: keyCount,
    };
  }

  @Get('db')
  async getDatabaseStatus() {
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
        console.error(`Database health check failed for ${name}:`, error.message);
      }
    }

    const allDbsHealthy = Object.values(dbStatus).every(status => status);

    return {
      status: allDbsHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      databases: dbStatus,
    };
  }
}
