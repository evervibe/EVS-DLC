import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../../src/modules/game/game.service';
import { TItemService } from '../../src/modules/data/t_item/t_item.service';
import { TSkillService } from '../../src/modules/data/t_skill/t_skill.service';
import { TSkilllevelService } from '../../src/modules/data/t_skilllevel/t_skilllevel.service';
import { TStringService } from '../../src/modules/data/t_string/t_string.service';

describe('GameService', () => {
  let service: GameService;
  let mockItemService: Partial<TItemService>;
  let mockSkillService: Partial<TSkillService>;
  let mockSkilllevelService: Partial<TSkilllevelService>;
  let mockStringService: Partial<TStringService>;

  beforeEach(async () => {
    mockItemService = {
      findAll: jest.fn().mockResolvedValue({ data: [], meta: { total: 0, limit: 50, offset: 0 } }),
    };
    mockSkillService = {
      findAll: jest.fn().mockResolvedValue({ data: [], meta: { total: 0, limit: 50, offset: 0 } }),
    };
    mockSkilllevelService = {
      findAll: jest.fn().mockResolvedValue({ data: [], meta: { total: 0, limit: 50, offset: 0 } }),
    };
    mockStringService = {
      findAll: jest.fn().mockResolvedValue({ data: [], meta: { total: 0, limit: 50, offset: 0 } }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        { provide: TItemService, useValue: mockItemService },
        { provide: TSkillService, useValue: mockSkillService },
        { provide: TSkilllevelService, useValue: mockSkilllevelService },
        { provide: TStringService, useValue: mockStringService },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return items', async () => {
    const result = await service.getItems({});
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(mockItemService.findAll).toHaveBeenCalled();
  });

  it('should return skills', async () => {
    const result = await service.getSkills();
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(mockSkillService.findAll).toHaveBeenCalled();
  });

  it('should return skill levels', async () => {
    const result = await service.getSkilllevels();
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(mockSkilllevelService.findAll).toHaveBeenCalled();
  });

  it('should return strings', async () => {
    const result = await service.getStrings();
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(mockStringService.findAll).toHaveBeenCalled();
  });
});
