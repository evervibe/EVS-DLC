import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { TItemService } from './t_item.service';
import { TItemEntity } from './t_item.entity';

@Controller('data/t_item')
export class TItemController {
  constructor(private readonly service: TItemService) {}

  @Get()
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<TItemEntity[]> {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : undefined;
    return this.service.findAll(limitNum, offsetNum);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TItemEntity | null> {
    return this.service.findOne(parseInt(id, 10));
  }

  @Post()
  async create(@Body() data: Partial<TItemEntity>): Promise<TItemEntity> {
    return this.service.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<TItemEntity>,
  ): Promise<TItemEntity | null> {
    return this.service.update(parseInt(id, 10), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(parseInt(id, 10));
  }
}
