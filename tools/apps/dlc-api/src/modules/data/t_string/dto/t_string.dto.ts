import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class TStringDtoBase {
  @IsDefined()
  @IsInt()
  a_index!: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  a_string_usa!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_ger?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_spn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_frc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_rus?: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  a_string!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_twn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_chn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_thai?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_thai_eng?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_twn2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_jpn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_mal?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_mal_eng?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_brz?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_hk?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_hk_eng?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_pld?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_tur?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_spn2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_frc2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_ita?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_mex?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_nld?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_uk?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_string_dev?: string;

}

export class CreateTStringDto extends TStringDtoBase {}
export class UpdateTStringDto extends PartialType(TStringDtoBase) {}
