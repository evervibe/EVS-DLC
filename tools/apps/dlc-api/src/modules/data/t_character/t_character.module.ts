import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TCharacterEntity } from './t_character.entity';
import { TCharacterController } from './t_character.controller';
import { TCharacterService } from './t_character.service';

@Module({
  imports: [TypeOrmModule.forFeature([TCharacterEntity])],
  controllers: [TCharacterController],
  providers: [TCharacterService],
  exports: [TCharacterService],
})
export class TCharacterModule {}
