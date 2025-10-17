import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class GetItemsDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}

export class DataItemDto {
  id: number;
  type: string;
  name: string;
  value: any;
}
