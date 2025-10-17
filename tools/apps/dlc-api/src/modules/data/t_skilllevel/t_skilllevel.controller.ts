import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { TSkilllevelService } from './t_skilllevel.service';
import { TSkilllevelEntity } from './t_skilllevel.entity';

@Controller('data/t_skilllevel')
export class TSkilllevelController {
  constructor(private readonly service: TSkilllevelService) {}

  @Get()
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<TSkilllevelEntity[]> {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : undefined;
    return this.service.findAll(
      limitNum && !isNaN(limitNum) ? limitNum : undefined,
      offsetNum && !isNaN(offsetNum) ? offsetNum : undefined,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TSkilllevelEntity | null> {
    return this.service.findOne(parseInt(id, 10));
  }

  @Post()
  async create(@Body() data: Partial<TSkilllevelEntity>): Promise<TSkilllevelEntity> {
    return this.service.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<TSkilllevelEntity>,
  ): Promise<TSkilllevelEntity | null> {
    return this.service.update(parseInt(id, 10), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(parseInt(id, 10));
  }
}
