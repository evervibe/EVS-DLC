import { Injectable } from '@nestjs/common';
import { dbPools } from '../../common/db';
import { createLogger } from '../../common/utils';
import { ApiError } from '../../common/errors';
import { GetItemsDto, ChangeCashDto, ItemResponseDto, CashResponseDto } from './game.dto';

@Injectable()
export class GameService {
  private logger = createLogger('GameService');

  async getItems(dto: GetItemsDto): Promise<ItemResponseDto[]> {
    this.logger.log('Fetching items', dto);
    
    try {
      // TODO: Implement actual database query
      // This is a placeholder returning mock data
      const mockItems: ItemResponseDto[] = [
        {
          id: 1,
          name: 'Sword',
          category: dto.category || 'weapon',
          price: 100,
          description: 'A basic sword',
        },
        {
          id: 2,
          name: 'Shield',
          category: dto.category || 'armor',
          price: 80,
          description: 'A basic shield',
        },
      ];

      return mockItems;
    } catch (error) {
      this.logger.error('Error fetching items', error.stack);
      throw ApiError.internal('Failed to fetch items');
    }
  }

  async changeCash(userCode: string, dto: ChangeCashDto): Promise<CashResponseDto> {
    this.logger.log(`Changing cash for user ${userCode}`, dto);

    try {
      // TODO: Implement actual database query
      // This is a placeholder returning mock data
      const previousCash = 1000;
      const newCash = previousCash + dto.amount;

      return {
        userCode,
        cash: newCash,
        previousCash,
        difference: dto.amount,
      };
    } catch (error) {
      this.logger.error('Error changing cash', error.stack);
      throw ApiError.internal('Failed to change cash');
    }
  }
}
