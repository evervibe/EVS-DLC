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
import { TSkillService } from './t_skill.service';
import { CreateTSkillDto, UpdateTSkillDto } from './dto/t_skill.dto';

@UseGuards(JwtAuthGuard)
@Controller('data/t_skill')
export class TSkillController {
  constructor(private readonly service: TSkillService) {}

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
    const skill = await this.service.findOne(id);
    return buildSuccessResponse(skill);
  }

  @Post()
  async create(@Body() data: CreateTSkillDto) {
    const skill = await this.service.create(data);
    return buildSuccessResponse(skill, 'Skill created successfully');
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTSkillDto,
  ) {
    const skill = await this.service.update(id, data);
    return buildSuccessResponse(skill, 'Skill updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return buildSuccessResponse(true, 'Skill removed successfully');
  }
}
