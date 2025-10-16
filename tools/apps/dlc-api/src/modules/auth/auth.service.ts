import { Injectable } from '@nestjs/common';
import { dbPools } from '../../common/db';
import { createLogger } from '../../common/utils';
import { ApiError } from '../../common/errors';
import { LoginDto, LoginResponseDto } from './auth.dto';

@Injectable()
export class AuthService {
  private logger = createLogger('AuthService');

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    this.logger.log('User login attempt', { username: dto.username });

    try {
      // TODO: Implement actual authentication logic
      // This is a placeholder returning mock data
      if (dto.username === 'demo' && dto.password === 'demo') {
        return {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            username: dto.username,
          },
        };
      }

      throw ApiError.unauthorized('Invalid credentials');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      this.logger.error('Login error', error.stack);
      throw ApiError.internal('Login failed');
    }
  }
}
