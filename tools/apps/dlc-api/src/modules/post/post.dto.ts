import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLogDto {
  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  metadata?: string;
}

export class LogResponseDto {
  id: number;
  level: string;
  message: string;
  metadata?: string;
  createdAt: Date;
}
