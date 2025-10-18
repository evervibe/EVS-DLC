import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { GetItemsDto, ChangeCashDto, ItemResponseDto, CashResponseDto } from './game.dto';
import { JwtAuthGuard } from '../../common/middleware';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('items')
  async getItems(@Query() query: GetItemsDto): Promise<any[]> {
    return this.gameService.getItems(query);
  }

  @Get('skills')
  async getSkills(): Promise<any[]> {
    return this.gameService.getSkills();
  }

  @Get('skilllevels')
  async getSkilllevels(): Promise<any[]> {
    return this.gameService.getSkilllevels();
  }

  @Get('strings')
  async getStrings(): Promise<any[]> {
    return this.gameService.getStrings();
  }

  @Post('accounts/:userCode/cash')
  @UseGuards(JwtAuthGuard)
  async changeCash(
    @Param('userCode') userCode: string,
    @Body() body: ChangeCashDto,
  ): Promise<CashResponseDto> {
    return this.gameService.changeCash(userCode, body);
  }
}
