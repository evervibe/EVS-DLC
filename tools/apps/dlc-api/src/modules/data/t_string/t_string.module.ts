import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TStringEntity } from './t_string.entity';
import { TStringController } from './t_string.controller';
import { TStringService } from './t_string.service';

@Module({
  imports: [TypeOrmModule.forFeature([TStringEntity])],
  controllers: [TStringController],
  providers: [TStringService],
  exports: [TStringService],
})
export class TStringModule {}
