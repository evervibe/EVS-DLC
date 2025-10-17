import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';
import { RedisConfig } from './redis.config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisConfig, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
