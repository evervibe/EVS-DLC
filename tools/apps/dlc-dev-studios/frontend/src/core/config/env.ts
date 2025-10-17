export const ENV = {
  APP_ENV: import.meta.env.VITE_APP_ENV,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  APP_VERSION: import.meta.env.VITE_APP_VERSION,
  API_URL: import.meta.env.VITE_API_URL,
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT || 8000),
  API_HEALTH_URL: import.meta.env.VITE_API_HEALTH_URL,
  REDIS_HEALTH_URL: import.meta.env.VITE_REDIS_HEALTH_URL,
  DB_HEALTH_URL: import.meta.env.VITE_DB_HEALTH_URL,
  ENABLE_DEBUG_PANEL: import.meta.env.VITE_ENABLE_DEBUG_PANEL === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  DATA_CACHE: import.meta.env.VITE_DATA_CACHE === 'true',
}
