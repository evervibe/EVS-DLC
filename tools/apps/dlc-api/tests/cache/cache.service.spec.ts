import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from '../../src/core/cache/cache.service';
import { RedisService } from '../../src/core/redis/redis.service';
import { RedisConfig } from '../../src/core/redis/redis.config';

describe('CacheService', () => {
  let cacheService: CacheService;
  let redisService: RedisService;

  describe('with cache disabled', () => {
    beforeEach(async () => {
      // Ensure cache is disabled
      process.env.USE_CACHE = 'false';

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
          }),
        ],
        providers: [
          RedisConfig,
          RedisService,
          CacheService,
        ],
      }).compile();

      cacheService = module.get<CacheService>(CacheService);
      redisService = module.get<RedisService>(RedisService);

      // Initialize Redis service
      await redisService.onModuleInit();
    });

    afterEach(async () => {
      await redisService.onModuleDestroy();
    });

    it('should be defined', () => {
      expect(cacheService).toBeDefined();
      expect(redisService).toBeDefined();
    });

    it('should not connect to Redis when disabled', () => {
      expect(redisService.isConnected()).toBe(false);
    });

    it('should bypass cache and execute function directly', async () => {
      let callCount = 0;
      const testFunction = async () => {
        callCount++;
        return { data: 'test', count: callCount };
      };

      // First call
      const result1 = await cacheService.wrap('test-key', testFunction);
      expect(result1.count).toBe(1);
      expect(callCount).toBe(1);

      // Second call - should execute function again (not cached)
      const result2 = await cacheService.wrap('test-key', testFunction);
      expect(result2.count).toBe(2);
      expect(callCount).toBe(2);
    });

    it('should handle get/set operations gracefully when disabled', async () => {
      await cacheService.set('test-key', { value: 'test' });
      const result = await cacheService.get('test-key');
      expect(result).toBeNull();
    });

    it('should handle invalidate operations gracefully when disabled', async () => {
      await expect(cacheService.invalidate('test-key')).resolves.not.toThrow();
    });

    it('should handle invalidatePattern operations gracefully when disabled', async () => {
      await expect(cacheService.invalidatePattern('test-*')).resolves.not.toThrow();
    });
  });

  describe('with cache enabled but Redis unavailable', () => {
    beforeEach(async () => {
      // Enable cache but use invalid Redis URL
      process.env.USE_CACHE = 'true';
      process.env.REDIS_URL = 'redis://localhost:9999';

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
          }),
        ],
        providers: [
          RedisConfig,
          RedisService,
          CacheService,
        ],
      }).compile();

      cacheService = module.get<CacheService>(CacheService);
      redisService = module.get<RedisService>(RedisService);

      // Initialize Redis service (will fail to connect)
      await redisService.onModuleInit();
    });

    afterEach(async () => {
      await redisService.onModuleDestroy();
    });

    it('should gracefully handle Redis connection failure', async () => {
      // Should not throw error
      expect(redisService.isConnected()).toBe(false);
    });

    it('should execute function when Redis is unavailable', async () => {
      let callCount = 0;
      const testFunction = async () => {
        callCount++;
        return { data: 'test' };
      };

      // Should execute function without error
      const result = await cacheService.wrap('test-key', testFunction);
      expect(result.data).toBe('test');
      expect(callCount).toBe(1);
    });
  });
});
