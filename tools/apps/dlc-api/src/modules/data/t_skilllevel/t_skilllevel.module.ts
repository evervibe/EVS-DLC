import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TSkilllevelEntity } from './t_skilllevel.entity';
import { TSkilllevelController } from './t_skilllevel.controller';
import { TSkilllevelService } from './t_skilllevel.service';

@Module({
  imports: [TypeOrmModule.forFeature([TSkilllevelEntity])],
  controllers: [TSkilllevelController],
  providers: [TSkilllevelService],
  exports: [TSkilllevelService],
})
export class TSkilllevelModule {}
