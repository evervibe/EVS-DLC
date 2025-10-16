import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class GetItemsDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}

export class ChangeCashDto {
  @IsNumber()
  amount: number;

  @IsString()
  reason: string;
}

export class ItemResponseDto {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
}

export class CashResponseDto {
  userCode: string;
  cash: number;
  previousCash: number;
  difference: number;
}
