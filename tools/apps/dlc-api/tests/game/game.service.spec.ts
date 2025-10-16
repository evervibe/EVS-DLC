import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../../src/modules/game/game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
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
  });
});
