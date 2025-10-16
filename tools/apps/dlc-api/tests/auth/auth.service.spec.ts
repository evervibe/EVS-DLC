import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login with valid credentials', async () => {
    const result = await service.login({
      username: 'demo',
      password: 'demo',
    });
    expect(result).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.user.username).toBe('demo');
  });
});
