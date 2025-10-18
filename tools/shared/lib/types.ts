/**
 * Shared types for EVS-DLC
 */

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface HealthReadyResponse {
  status: string;
  databases: Record<string, string>;
  cache?: string;
}

export interface Item {
  id: number;
  name: string;
  description?: string;
  type?: string;
  rarity?: string;
  level?: number;
  price?: number;
  stats?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: number;
  name: string;
  description?: string;
  type?: string;
  cooldown?: number;
  manaCost?: number;
  damage?: number;
  range?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillLevel {
  id: number;
  skillId: number;
  level: number;
  requiredLevel?: number;
  requiredXP?: number;
  bonuses?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameString {
  id: number;
  key: string;
  locale: string;
  value: string;
  context?: string;
  createdAt?: string;
  updatedAt?: string;
}
