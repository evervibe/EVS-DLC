import { ENV } from '../config/env';

export interface HealthStatus {
  api: boolean;
  redis: boolean;
  db: boolean;
}

export async function checkHealth(): Promise<HealthStatus> {
  try {
    const [api, redis, db] = await Promise.all([
      fetch(ENV.API_HEALTH_URL),
      fetch(ENV.REDIS_HEALTH_URL),
      fetch(ENV.DB_HEALTH_URL)
    ]);
    return {
      api: api.ok,
      redis: redis.ok,
      db: db.ok,
    };
  } catch (err) {
    console.error('Health check failed', err);
    return { api: false, redis: false, db: false };
  }
}
