import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { GetItemsDto, ChangeCashDto, ItemResponseDto, CashResponseDto } from './game.dto';
import { JwtAuthGuard } from '../../common/middleware';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('items')
  async getItems(@Query() query: GetItemsDto): Promise<ItemResponseDto[]> {
    return this.gameService.getItems(query);
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
