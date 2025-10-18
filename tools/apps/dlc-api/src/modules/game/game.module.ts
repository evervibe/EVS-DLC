import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TItemModule } from '../data/t_item/t_item.module';
import { TSkillModule } from '../data/t_skill/t_skill.module';
import { TSkilllevelModule } from '../data/t_skilllevel/t_skilllevel.module';
import { TStringModule } from '../data/t_string/t_string.module';

@Module({
  imports: [TItemModule, TSkillModule, TSkilllevelModule, TStringModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
