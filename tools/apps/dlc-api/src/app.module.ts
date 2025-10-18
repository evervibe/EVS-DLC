import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/auth.module';
import { GameModule } from './modules/game/game.module';
import { DataModule } from './modules/data/data.module';
import { PostModule } from './modules/post/post.module';
import { HealthModule } from './modules/health/health.module';
import { OpsModule } from './modules/ops/ops.module';
import { StringsModule } from './modules/strings/strings.module';
import { GlobalExceptionFilter, NotFoundExceptionFilter } from './common/errors';
import { RedisModule } from './core/redis/redis.module';
import { CacheModule } from './core/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        API_PORT: Joi.number().default(30089),
        NODE_ENV: Joi.string().default('development'),
        JWT_SECRET: Joi.string().default('dev-secret'),
        JWT_EXPIRES_IN: Joi.number().default(3600),
        ADMIN_USERNAME: Joi.string().default('admin'),
        ADMIN_PASSWORD: Joi.string().allow('').default('admin'),

        // Auth Database
        DB_AUTH_HOST: Joi.string().default('localhost'),
        DB_AUTH_PORT: Joi.number().default(3306),
        DB_AUTH_USER: Joi.string().default('root'),
        DB_AUTH_PASS: Joi.string().allow('').default('root'),
        DB_AUTH_NAME: Joi.string().default('db_auth'),
        
        // Game Database
        DB_GAME_HOST: Joi.string().default('localhost'),
        DB_GAME_PORT: Joi.number().default(3306),
        DB_GAME_USER: Joi.string().default('root'),
        DB_GAME_PASS: Joi.string().allow('').default('root'),
        DB_GAME_NAME: Joi.string().default('db_game'),
        
        // Data Database
        DB_DATA_HOST: Joi.string().default('localhost'),
        DB_DATA_PORT: Joi.number().default(3306),
        DB_DATA_USER: Joi.string().default('root'),
        DB_DATA_PASS: Joi.string().allow('').default('root'),
        DB_DATA_NAME: Joi.string().default('db_data'),
        
        // Post Database
        DB_POST_HOST: Joi.string().default('localhost'),
        DB_POST_PORT: Joi.number().default(3306),
        DB_POST_USER: Joi.string().default('root'),
        DB_POST_PASS: Joi.string().allow('').default('root'),
        DB_POST_NAME: Joi.string().default('db_post'),
        
        // Cache/Redis Configuration
        USE_CACHE: Joi.boolean().default(false),
        REDIS_URL: Joi.string().uri().default('redis://localhost:6379'),
        CACHE_TTL: Joi.number().default(120),
        CACHE_PREFIX: Joi.string().default('dlc'),
        PRELOAD_ON_START: Joi.boolean().default(false),
        PRELOAD_TABLES: Joi.string().allow('').default(''),
      }),
    }),
    RedisModule,
    CacheModule,
    AuthModule,
    GameModule,
    DataModule,
    PostModule,
    HealthModule,
    OpsModule,
    StringsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
