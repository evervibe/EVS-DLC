import { Injectable } from '@nestjs/common';
import { createLogger } from '../../common/utils';
import { ApiError } from '../../common/errors';
import { GetItemsDto, ChangeCashDto, ItemResponseDto, CashResponseDto } from './game.dto';
import { TItemService } from '../data/t_item/t_item.service';
import { TSkillService } from '../data/t_skill/t_skill.service';
import { TSkilllevelService } from '../data/t_skilllevel/t_skilllevel.service';
import { TStringService } from '../data/t_string/t_string.service';

@Injectable()
export class GameService {
  private logger = createLogger('GameService');

  constructor(
    private readonly itemService: TItemService,
    private readonly skillService: TSkillService,
    private readonly skilllevelService: TSkilllevelService,
    private readonly stringService: TStringService,
  ) {}

  async getItems(dto: GetItemsDto): Promise<any[]> {
    this.logger.log('Fetching items via game alias', dto);
    
    try {
      const result = await this.itemService.findAll({
        limit: dto.limit,
        offset: dto.offset,
        search: dto.search,
      });
      return result.data;
    } catch (error) {
      this.logger.error('Error fetching items', error instanceof Error ? error.stack : undefined);
      throw ApiError.internal('Failed to fetch items');
    }
  }

  async getSkills(): Promise<any[]> {
    this.logger.log('Fetching skills via game alias');
    
    try {
      const result = await this.skillService.findAll({ limit: 1000 });
      return result.data;
    } catch (error) {
      this.logger.error('Error fetching skills', error instanceof Error ? error.stack : undefined);
      throw ApiError.internal('Failed to fetch skills');
    }
  }

  async getSkilllevels(): Promise<any[]> {
    this.logger.log('Fetching skill levels via game alias');
    
    try {
      const result = await this.skilllevelService.findAll({ limit: 1000 });
      return result.data;
    } catch (error) {
      this.logger.error('Error fetching skill levels', error instanceof Error ? error.stack : undefined);
      throw ApiError.internal('Failed to fetch skill levels');
    }
  }

  async getStrings(): Promise<any[]> {
    this.logger.log('Fetching strings via game alias');
    
    try {
      const result = await this.stringService.findAll({ limit: 1000 });
      return result.data;
    } catch (error) {
      this.logger.error('Error fetching strings', error instanceof Error ? error.stack : undefined);
      throw ApiError.internal('Failed to fetch strings');
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
      this.logger.error('Error changing cash', error instanceof Error ? error.stack : undefined);
      throw ApiError.internal('Failed to change cash');
    }
  }
}
