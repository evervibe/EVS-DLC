import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface CacheConfig {
  useCache: boolean;
  redisUrl: string;
  cacheTTL: number;
  cachePrefix: string;
  preloadOnStart: boolean;
  preloadTables: string;
}

export interface EnvConfig {
  apiPort: number;
  nodeEnv: string;
  jwtSecret: string;
  dbAuth: DatabaseConfig;
  dbGame: DatabaseConfig;
  dbData: DatabaseConfig;
  dbPost: DatabaseConfig;
  cache: CacheConfig;
}

function getEnvValue(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  return value;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

export const env: EnvConfig = {
  apiPort: getEnvNumber('API_PORT', 4000),
  nodeEnv: getEnvValue('NODE_ENV', 'development'),
  jwtSecret: getEnvValue('JWT_SECRET', 'dev-secret'),
  
  dbAuth: {
    host: getEnvValue('DB_AUTH_HOST', 'localhost'),
    port: getEnvNumber('DB_AUTH_PORT', 3306),
    user: getEnvValue('DB_AUTH_USER', 'root'),
    password: getEnvValue('DB_AUTH_PASS', 'root'),
    database: getEnvValue('DB_AUTH_NAME', 'db_auth'),
  },
  
  dbGame: {
    host: getEnvValue('DB_GAME_HOST', 'localhost'),
    port: getEnvNumber('DB_GAME_PORT', 3306),
    user: getEnvValue('DB_GAME_USER', 'root'),
    password: getEnvValue('DB_GAME_PASS', 'root'),
    database: getEnvValue('DB_GAME_NAME', 'db_db'),
  },
  
  dbData: {
    host: getEnvValue('DB_DATA_HOST', 'localhost'),
    port: getEnvNumber('DB_DATA_PORT', 3306),
    user: getEnvValue('DB_DATA_USER', 'root'),
    password: getEnvValue('DB_DATA_PASS', 'root'),
    database: getEnvValue('DB_DATA_NAME', 'db_data'),
  },
  
  dbPost: {
    host: getEnvValue('DB_POST_HOST', 'localhost'),
    port: getEnvNumber('DB_POST_PORT', 3306),
    user: getEnvValue('DB_POST_USER', 'root'),
    password: getEnvValue('DB_POST_PASS', 'root'),
    database: getEnvValue('DB_POST_NAME', 'db_post'),
  },
  
  cache: {
    useCache: getEnvBoolean('USE_CACHE', false),
    redisUrl: getEnvValue('REDIS_URL', 'redis://localhost:6379'),
    cacheTTL: getEnvNumber('CACHE_TTL', 120),
    cachePrefix: getEnvValue('CACHE_PREFIX', 'dlc'),
    preloadOnStart: getEnvBoolean('PRELOAD_ON_START', false),
    preloadTables: getEnvValue('PRELOAD_TABLES', ''),
  },
};
