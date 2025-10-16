import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from '../../src/modules/data/data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataService],
    }).compile();

    service = module.get<DataService>(DataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return data items', async () => {
    const result = await service.getItems({});
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
