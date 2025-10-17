import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { createLogger } from '../../common/utils';
import { ApiError } from '../../common/errors';
import { LoginDto, LoginResponseDto } from './auth.dto';
import { env } from '../../config/env';

@Injectable()
export class AuthService {
  private logger = createLogger('AuthService');

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    this.logger.log('User login attempt', { username: dto.username });

    try {
      const { username, password } = env.admin;

      if (dto.username !== username || dto.password !== password) {
        throw ApiError.unauthorized('Invalid credentials', 'AUTH_INVALID_CREDENTIALS');
      }

      const payload = {
        sub: username,
        username,
        roles: ['admin'],
      };

      const token = sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
      const expiresAt = new Date(Date.now() + env.jwtExpiresIn * 1000).toISOString();

      this.logger.log('User authenticated', { username: dto.username });

      return {
        token,
        expiresAt,
        user: {
          id: username,
          username,
          roles: ['admin'],
        },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      this.logger.error('Login error', error instanceof Error ? error.stack : undefined);
      throw ApiError.internal('Login failed');
    }
  }
}
