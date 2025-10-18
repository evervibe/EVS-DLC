const normalizeBaseUrl = (value?: string, fallback = 'http://localhost:30089') => {
  const trimmed = value?.trim() || fallback
  return trimmed.replace(/\/+$/, '')
}

const normalizeBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback
  }

  return value === 'true'
}

const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_URL)

export const ENV = {
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'DLC Web Admin',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0-alpha',
  API_URL: apiBaseUrl,
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT ?? 8000),
  API_HEALTH_URL:
    import.meta.env.VITE_API_HEALTH_URL?.trim() || `${apiBaseUrl}/health`,
  REDIS_HEALTH_URL:
    import.meta.env.VITE_REDIS_HEALTH_URL?.trim() || `${apiBaseUrl}/ops/redis`,
  DB_HEALTH_URL:
    import.meta.env.VITE_DB_HEALTH_URL?.trim() || `${apiBaseUrl}/ops/db`,
  ENABLE_DEBUG_PANEL: normalizeBoolean(import.meta.env.VITE_ENABLE_DEBUG_PANEL, true),
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'debug',
  DATA_CACHE: normalizeBoolean(import.meta.env.VITE_DATA_CACHE, true),
}
