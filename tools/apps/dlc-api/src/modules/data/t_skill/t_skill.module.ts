import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TSkillEntity } from './t_skill.entity';
import { TSkillController } from './t_skill.controller';
import { TSkillService } from './t_skill.service';

@Module({
  imports: [TypeOrmModule.forFeature([TSkillEntity])],
  controllers: [TSkillController],
  providers: [TSkillService],
  exports: [TSkillService],
})
export class TSkillModule {}
