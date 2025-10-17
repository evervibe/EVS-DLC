import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { TStringService } from './t_string.service';
import { TStringEntity } from './t_string.entity';

@Controller('data/t_string')
export class TStringController {
  constructor(private readonly service: TStringService) {}

  @Get()
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<TStringEntity[]> {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : undefined;
    return this.service.findAll(limitNum, offsetNum);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TStringEntity | null> {
    return this.service.findOne(parseInt(id, 10));
  }

  @Post()
  async create(@Body() data: Partial<TStringEntity>): Promise<TStringEntity> {
    return this.service.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<TStringEntity>,
  ): Promise<TStringEntity | null> {
    return this.service.update(parseInt(id, 10), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(parseInt(id, 10));
  }
}
