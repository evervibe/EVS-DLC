import { IsString, IsOptional, IsNumber } from 'class-validator';

export class GetItemsDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class DataItemDto {
  id: number;
  type: string;
  name: string;
  value: any;
}
