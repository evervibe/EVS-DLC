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
        JWT_SECRET: Joi.string().default('dev-secret'),
        
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
