import { ENV } from '../config/env';

export interface HealthStatus {
  api: boolean;
  redis: boolean;
  db: boolean;
}

export async function checkHealth(): Promise<HealthStatus> {
  const endpoints = [
    { key: 'api' as const, url: ENV.API_HEALTH_URL },
    { key: 'redis' as const, url: ENV.REDIS_HEALTH_URL },
    { key: 'db' as const, url: ENV.DB_HEALTH_URL },
  ]

  const responses = await Promise.allSettled(endpoints.map((endpoint) => fetch(endpoint.url)))

  return responses.reduce<HealthStatus>((status, result, index) => {
    const key = endpoints[index].key

    if (result.status === 'fulfilled') {
      status[key] = result.value.ok
    } else {
      console.warn(`Health check for ${key} failed`, result.reason)
      status[key] = false
    }

    return status
  }, { api: false, redis: false, db: false })
}
