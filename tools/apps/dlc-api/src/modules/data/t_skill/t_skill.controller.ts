import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TSkillService } from './t_skill.service';
import { TSkillEntity } from './t_skill.entity';

@Controller('data/t_skill')
export class TSkillController {
  constructor(private readonly service: TSkillService) {}

  @Get()
  async findAll(): Promise<TSkillEntity[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TSkillEntity | null> {
    return this.service.findOne(parseInt(id, 10));
  }

  @Post()
  async create(@Body() data: Partial<TSkillEntity>): Promise<TSkillEntity> {
    return this.service.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<TSkillEntity>,
  ): Promise<TSkillEntity | null> {
    return this.service.update(parseInt(id, 10), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(parseInt(id, 10));
  }
}
