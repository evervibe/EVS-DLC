import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, Public } from '../../../common/middleware';
import { buildSuccessResponse } from '../../../common/utils';
import { ListQueryDto } from '../dto/list-query.dto';
import { TItemService } from './t_item.service';
import { CreateTItemDto, UpdateTItemDto } from './dto/t_item.dto';

@UseGuards(JwtAuthGuard)
@Controller('data/t_item')
export class TItemController {
  constructor(private readonly service: TItemService) {}

  @Get()
  async findAll(@Query() query: ListQueryDto) {
    const result = await this.service.findAll(query);
    return buildSuccessResponse(result.data, undefined, result.meta);
  }

  @Public()
  @Get('count')
  async count() {
    const result = await this.service.count();
    return buildSuccessResponse(result);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const item = await this.service.findOne(id);
    return buildSuccessResponse(item);
  }

  @Post()
  async create(@Body() data: CreateTItemDto) {
    const item = await this.service.create(data);
    return buildSuccessResponse(item, 'Item created successfully');
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTItemDto,
  ) {
    const item = await this.service.update(id, data);
    return buildSuccessResponse(item, 'Item updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return buildSuccessResponse(true, 'Item removed successfully');
  }
}
