import { Controller, Get } from '@nestjs/common';
import { dbPools } from '../../common/db';

@Controller('health')
export class HealthController {
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

    return {
      status: allDbsHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.5.0',
      databases: dbStatus,
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
