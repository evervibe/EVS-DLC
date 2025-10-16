import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { GameModule } from './modules/game/game.module';
import { DataModule } from './modules/data/data.module';
import { PostModule } from './modules/post/post.module';
import { GlobalExceptionFilter } from './common/errors';
import { validationPipe } from './common/middleware';

@Module({
  imports: [
    AuthModule,
    GameModule,
    DataModule,
    PostModule,
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
