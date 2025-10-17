import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisConfig } from './redis.config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private _isConnected = false;

  constructor(private config: RedisConfig) {}

  async onModuleInit() {
    if (!this.config.enabled) {
      this.logger.log('Cache is disabled (USE_CACHE=false)');
      return;
    }

    try {
      this.client = new Redis(this.config.url, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err) => {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            return true;
          }
          return false;
        },
      });

      this.client.on('connect', () => {
        this._isConnected = true;
        this.logger.log(`✅ Redis connected on ${this.config.url}`);
      });

      this.client.on('error', (err) => {
        this._isConnected = false;
        this.logger.error(`Redis connection error: ${err.message}`);
      });

      this.client.on('close', () => {
        this._isConnected = false;
        this.logger.warn('Redis connection closed');
      });

      // Wait for connection
      await this.client.ping();
      this._isConnected = true;
    } catch (error) {
      this.logger.error(`Failed to connect to Redis: ${error.message}`);
      this._isConnected = false;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this._isConnected = false;
    }
  }

  isConnected(): boolean {
    return this._isConnected && this.client !== null;
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected()) return null;
    try {
      const fullKey = `${this.config.prefix}:${key}`;
      return await this.client!.get(fullKey);
    } catch (error) {
      this.logger.error(`Redis GET error for key ${key}: ${error.message}`);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.isConnected()) return;
    try {
      const fullKey = `${this.config.prefix}:${key}`;
      const effectiveTTL = ttl || this.config.defaultTTL;
      await this.client!.setex(fullKey, effectiveTTL, value);
    } catch (error) {
      this.logger.error(`Redis SET error for key ${key}: ${error.message}`);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected()) return;
    try {
      const fullKey = `${this.config.prefix}:${key}`;
      await this.client!.del(fullKey);
    } catch (error) {
      this.logger.error(`Redis DEL error for key ${key}: ${error.message}`);
    }
  }

  async keys(pattern: string): Promise<string[]> {
    if (!this.isConnected()) return [];
    try {
      const fullPattern = `${this.config.prefix}:${pattern}`;
      const keys = await this.client!.keys(fullPattern);
      // Remove prefix from keys
      return keys.map(k => k.replace(`${this.config.prefix}:`, ''));
    } catch (error) {
      this.logger.error(`Redis KEYS error for pattern ${pattern}: ${error.message}`);
      return [];
    }
  }

  async count(): Promise<number> {
    if (!this.isConnected()) return 0;
    try {
      const keys = await this.client!.keys(`${this.config.prefix}:*`);
      return keys.length;
    } catch (error) {
      this.logger.error(`Redis COUNT error: ${error.message}`);
      return 0;
    }
  }
}
