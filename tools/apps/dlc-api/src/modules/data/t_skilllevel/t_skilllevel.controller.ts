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
import { JwtAuthGuard } from '../../../common/middleware';
import { buildSuccessResponse } from '../../../common/utils';
import { TSkilllevelService } from './t_skilllevel.service';
import { SkillLevelQueryDto } from './dto/t_skilllevel-query.dto';
import { CreateTSkilllevelDto, UpdateTSkilllevelDto } from './dto/t_skilllevel.dto';

@UseGuards(JwtAuthGuard)
@Controller('data/t_skilllevel')
export class TSkilllevelController {
  constructor(private readonly service: TSkilllevelService) {}

  @Get()
  async findAll(@Query() query: SkillLevelQueryDto) {
    const result = await this.service.findAll(query);
    return buildSuccessResponse(result.data, undefined, result.meta);
  }

  @Get('count')
  async count() {
    const result = await this.service.count();
    return buildSuccessResponse(result);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const level = await this.service.findOne(id);
    return buildSuccessResponse(level);
  }

  @Post()
  async create(@Body() data: CreateTSkilllevelDto) {
    const level = await this.service.create(data);
    return buildSuccessResponse(level, 'Skill level created successfully');
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTSkilllevelDto,
  ) {
    const level = await this.service.update(id, data);
    return buildSuccessResponse(level, 'Skill level updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return buildSuccessResponse(true, 'Skill level removed successfully');
  }
}
