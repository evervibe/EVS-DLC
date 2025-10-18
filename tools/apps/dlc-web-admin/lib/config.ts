/**
 * API Configuration
 * Centralized API base URL and endpoint configuration
 */

export const API_BASE = 
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30089';

export const API_ENDPOINTS = {
  // Health & Monitoring
  health: `${API_BASE}/health`,
  healthReady: `${API_BASE}/health/ready`,
  
  // Data Management
  items: `${API_BASE}/game/items`,
  skills: `${API_BASE}/game/skills`,
  skilllevels: `${API_BASE}/game/skilllevels`,
  strings: `${API_BASE}/game/strings`,
  
  // Operations (for future use)
  redis: `${API_BASE}/ops/redis`,
  db: `${API_BASE}/ops/db`,
} as const;

export const APP_CONFIG = {
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.2.0',
  env: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  debug: process.env.NEXT_PUBLIC_DEBUG === 'true',
} as const;
