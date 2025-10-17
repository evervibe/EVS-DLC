import { IsDefined, IsInt, IsOptional, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class TSkilllevelDtoBase {
  @IsDefined()
  @IsInt()
  @Min(0)
  a_index!: number;

  @IsDefined()
  @IsInt()
  @Min(0)
  a_level!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_needHP?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_needMP?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_needGP?: number;

  @IsOptional()
  @IsInt()
  a_durtime?: number;

  @IsOptional()
  @IsInt()
  a_dummypower?: number;

  @IsOptional()
  @IsInt()
  a_needItemIndex1?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_needItemCount1?: number;

  @IsOptional()
  @IsInt()
  a_needItemIndex2?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_needItemCount2?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_learnLevel?: number;

  @IsOptional()
  @IsInt()
  a_challenger?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_learnSP?: number;

  @IsOptional()
  @IsInt()
  a_learnSkillIndex1?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_learnSkillLevel1?: number;

  @IsOptional()
  @IsInt()
  a_learnSkillIndex2?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_learnSkillLevel2?: number;

  @IsOptional()
  @IsInt()
  a_learnSkillIndex3?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_learnSkillLevel3?: number;

  @IsOptional()
  @IsInt()
  a_learnItemIndex1?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_learnItemCount1?: number;

  @IsOptional()
  @IsInt()
  a_learnItemIndex2?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_learnItemCount2?: number;

  @IsOptional()
  @IsInt()
  a_learnItemIndex3?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_learnItemCount3?: number;

  @IsOptional()
  @IsInt()
  a_appMagicIndex1?: number;

  @IsOptional()
  @IsInt()
  a_appMagicLevel1?: number;

  @IsOptional()
  @IsInt()
  a_appMagicIndex2?: number;

  @IsOptional()
  @IsInt()
  a_appMagicLevel2?: number;

  @IsOptional()
  @IsInt()
  a_appMagicIndex3?: number;

  @IsOptional()
  @IsInt()
  a_appMagicLevel3?: number;

  @IsOptional()
  @IsInt()
  a_magicIndex1?: number;

  @IsOptional()
  @IsInt()
  a_magicLevel1?: number;

  @IsOptional()
  @IsInt()
  a_magicIndex2?: number;

  @IsOptional()
  @IsInt()
  a_magicLevel2?: number;

  @IsOptional()
  @IsInt()
  a_magicIndex3?: number;

  @IsOptional()
  @IsInt()
  a_magicLevel3?: number;

  @IsOptional()
  @IsInt()
  a_learnstr?: number;

  @IsOptional()
  @IsInt()
  a_learndex?: number;

  @IsOptional()
  @IsInt()
  a_learnint?: number;

  @IsOptional()
  @IsInt()
  a_learncon?: number;

  @IsOptional()
  @IsInt()
  a_hate?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_learnGP?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_use_count?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  a_targetNum?: number;

}

export class CreateTSkilllevelDto extends TSkilllevelDtoBase {}
export class UpdateTSkilllevelDto extends PartialType(TSkilllevelDtoBase) {}
