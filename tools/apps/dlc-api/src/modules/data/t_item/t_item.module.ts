import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TItemEntity } from './t_item.entity';
import { TItemController } from './t_item.controller';
import { TItemService } from './t_item.service';

@Module({
  imports: [TypeOrmModule.forFeature([TItemEntity])],
  controllers: [TItemController],
  providers: [TItemService],
  exports: [TItemService],
})
export class TItemModule {}
