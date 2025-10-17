import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly enabled: boolean;
  private readonly defaultTTL: number;

  constructor(
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.enabled = this.configService.get<boolean>('USE_CACHE', false);
    this.defaultTTL = this.configService.get<number>('CACHE_TTL', 120);
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled || !this.redis.isConnected()) {
      return null;
    }

    try {
      const cached = await this.redis.get(key);
      if (cached) {
        this.logger.debug(`Cache HIT for key: ${key}`);
        return JSON.parse(cached);
      }
      this.logger.debug(`Cache MISS for key: ${key}`);
      return null;
    } catch (error) {
      this.logger.error(`Cache GET error for key ${key}: ${error.message}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.enabled || !this.redis.isConnected()) {
      return;
    }

    try {
      const effectiveTTL = ttl || this.defaultTTL;
      await this.redis.set(key, JSON.stringify(value), effectiveTTL);
      this.logger.debug(`Cache SET for key: ${key}, TTL: ${effectiveTTL}s`);
    } catch (error) {
      this.logger.error(`Cache SET error for key ${key}: ${error.message}`);
    }
  }

  async invalidate(key: string): Promise<void> {
    if (!this.enabled || !this.redis.isConnected()) {
      return;
    }

    try {
      await this.redis.del(key);
      this.logger.debug(`Cache INVALIDATE for key: ${key}`);
    } catch (error) {
      this.logger.error(`Cache INVALIDATE error for key ${key}: ${error.message}`);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.enabled || !this.redis.isConnected()) {
      return;
    }

    try {
      const keys = await this.redis.keys(pattern);
      for (const key of keys) {
        await this.redis.del(key);
      }
      this.logger.debug(`Cache INVALIDATE pattern: ${pattern}, deleted ${keys.length} keys`);
    } catch (error) {
      this.logger.error(`Cache INVALIDATE pattern error for ${pattern}: ${error.message}`);
    }
  }

  async wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    if (!this.enabled) {
      return fn();
    }

    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fn();
    await this.set(key, data, ttl);
    return data;
  }
}
