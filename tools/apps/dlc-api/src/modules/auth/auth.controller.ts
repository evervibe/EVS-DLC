import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './auth.dto';
import { buildSuccessResponse } from '../../common/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const response = await this.authService.login(body);
    return buildSuccessResponse<LoginResponseDto>(response, 'Login successful');
  }
}
