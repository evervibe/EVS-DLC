import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { TItemModule } from './t_item/t_item.module';
import { TStringModule } from './t_string/t_string.module';
import { TSkillModule } from './t_skill/t_skill.module';
import { TSkilllevelModule } from './t_skilllevel/t_skilllevel.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_DATA_HOST || 'localhost',
      port: parseInt(process.env.DB_DATA_PORT || '3306', 10),
      username: process.env.DB_DATA_USER || 'root',
      password: process.env.DB_DATA_PASSWORD || '',
      database: process.env.DB_DATA_NAME || 'db_data',
      autoLoadEntities: true,
      synchronize: false,
    }),
    TItemModule,
    TStringModule,
    TSkillModule,
    TSkilllevelModule,
  ],
  controllers: [DataController],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
