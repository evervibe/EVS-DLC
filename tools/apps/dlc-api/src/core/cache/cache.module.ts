import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from './cache.service';
import { DataPreloaderService } from './data-preloader.service';
import { RedisModule } from '../redis/redis.module';

@Global()
@Module({
  imports: [ConfigModule, RedisModule],
  providers: [CacheService, DataPreloaderService],
  exports: [CacheService],
})
export class CacheModule {}
