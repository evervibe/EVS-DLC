import { Module } from '@nestjs/common';
import { OpsController } from './ops.controller';
import { RedisModule } from '../../core/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [OpsController],
})
export class OpsModule {}
