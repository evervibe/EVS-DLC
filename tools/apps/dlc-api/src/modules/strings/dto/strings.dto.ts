import { IsOptional, IsString, IsEnum, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Locale, WorkflowStatus } from '@evs-dlc/shared-lib';

/**
 * Query DTO for listing strings with filters
 */
export class StringsListQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsEnum(['usa', 'ger', 'spn', 'frc', 'rus', 'kor', 'twn', 'chn', 'thai', 'thai_eng', 'twn2', 'jpn', 'mal', 'mal_eng', 'brz', 'hk', 'hk_eng', 'pld', 'tur', 'spn2', 'frc2', 'ita', 'mex', 'nld', 'uk', 'dev'])
  langMissing?: Locale;

  @IsOptional()
  @IsEnum(['draft', 'review', 'approved'])
  status?: WorkflowStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  orderDir?: 'ASC' | 'DESC';
}

/**
 * DTO for updating string values
 */
export class UpdateStringValuesDto {
  [key: string]: any;
}

/**
 * DTO for submitting for review
 */
export class SubmitReviewDto {
  @IsOptional()
  @IsString()
  comment?: string;
}

/**
 * DTO for approving a string
 */
export class ApproveStringDto {
  @IsOptional()
  @IsString()
  comment?: string;
}

/**
 * DTO for rejecting a string
 */
export class RejectStringDto {
  @IsString()
  reason: string;
}

/**
 * DTO for bulk import query params
 */
export class BulkImportQueryDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  dryRun?: boolean;
}

/**
 * DTO for export publish
 */
export class ExportPublishDto {
  @IsString()
  version: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * DTO for export format query
 */
export class ExportFormatQueryDto {
  @IsOptional()
  @IsEnum(['load'])
  format?: 'load';
}
