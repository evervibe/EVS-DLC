import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  token: string;
  expiresAt: string;
  user: {
    id: string;
    username: string;
    roles: string[];
  };
}
