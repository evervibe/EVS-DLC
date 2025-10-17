import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/auth.module';
import { GameModule } from './modules/game/game.module';
import { DataModule } from './modules/data/data.module';
import { PostModule } from './modules/post/post.module';
import { HealthModule } from './modules/health/health.module';
import { GlobalExceptionFilter } from './common/errors';
import { validationPipe } from './common/middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        API_PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string().default('development'),
        JWT_SECRET: Joi.string().required(),
        
        // Auth Database
        DB_AUTH_HOST: Joi.string().required(),
        DB_AUTH_PORT: Joi.number().required(),
        DB_AUTH_USER: Joi.string().required(),
        DB_AUTH_PASS: Joi.string().allow('').optional(),
        DB_AUTH_NAME: Joi.string().required(),
        
        // Game Database
        DB_GAME_HOST: Joi.string().required(),
        DB_GAME_PORT: Joi.number().required(),
        DB_GAME_USER: Joi.string().required(),
        DB_GAME_PASS: Joi.string().allow('').optional(),
        DB_GAME_NAME: Joi.string().required(),
        
        // Data Database
        DB_DATA_HOST: Joi.string().required(),
        DB_DATA_PORT: Joi.number().required(),
        DB_DATA_USER: Joi.string().required(),
        DB_DATA_PASS: Joi.string().allow('').optional(),
        DB_DATA_NAME: Joi.string().required(),
        
        // Post Database
        DB_POST_HOST: Joi.string().required(),
        DB_POST_PORT: Joi.number().required(),
        DB_POST_USER: Joi.string().required(),
        DB_POST_PASS: Joi.string().allow('').optional(),
        DB_POST_NAME: Joi.string().required(),
      }),
    }),
    AuthModule,
    GameModule,
    DataModule,
    PostModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: validationPipe,
    },
  ],
})
export class AppModule {}
