import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfig {
  constructor(private configService: ConfigService) {}

  get url(): string {
    return this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');
  }

  get enabled(): boolean {
    return this.configService.get<boolean>('USE_CACHE', false);
  }

  get prefix(): string {
    return this.configService.get<string>('CACHE_PREFIX', 'dlc');
  }

  get defaultTTL(): number {
    return this.configService.get<number>('CACHE_TTL', 120);
  }
}
