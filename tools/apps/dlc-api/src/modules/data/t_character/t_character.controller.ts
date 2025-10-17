import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TCharacterService } from './t_character.service';
import { TCharacterEntity } from './t_character.entity';

@Controller('data/t_character')
export class TCharacterController {
  constructor(private readonly service: TCharacterService) {}

  @Get()
  async findAll(): Promise<TCharacterEntity[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TCharacterEntity | null> {
    return this.service.findOne(parseInt(id, 10));
  }

  @Post()
  async create(@Body() data: Partial<TCharacterEntity>): Promise<TCharacterEntity> {
    return this.service.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<TCharacterEntity>,
  ): Promise<TCharacterEntity | null> {
    return this.service.update(parseInt(id, 10), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(parseInt(id, 10));
  }
}
