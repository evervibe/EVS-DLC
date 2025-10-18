import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TStringEntity } from '../data/t_string/t_string.entity';
import { StringMetaEntity } from '../data/string-meta/string-meta.entity';
import { CacheModule } from '../../core/cache/cache.module';
import { StringsController } from './strings.controller';
import { StringsService } from './strings.service';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([TStringEntity, StringMetaEntity]),
    CacheModule,
  ],
  controllers: [StringsController],
  providers: [StringsService, RolesGuard],
  exports: [StringsService],
})
export class StringsModule {}
