import { Controller, Get, Query } from '@nestjs/common';
import { DataService } from './data.service';
import { GetItemsDto, DataItemDto } from './data.dto';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('items')
  async getItems(@Query() query: GetItemsDto): Promise<DataItemDto[]> {
    return this.dataService.getItems(query);
  }
}
