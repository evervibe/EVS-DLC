import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class TSkillDtoBase {
  @IsDefined()
  @IsInt()
  @Min(0)
  a_index!: number;

  @IsDefined()
  @IsInt()
  @Min(0)
  a_job!: number;

  @IsOptional()
  @IsInt()
  a_job2?: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  a_name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  a_name_twn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  a_name_chn?: string;

  @IsDefined()
  @IsInt()
  @Min(0)
  a_type!: number;

  @IsOptional()
  @IsInt()
  a_flag?: number;

  @IsDefined()
  @IsInt()
  @Min(1)
  a_maxLevel!: number;

  @IsOptional()
  @IsNumber()
  a_appRange?: number;

  @IsOptional()
  @IsNumber()
  a_fireRange?: number;

  @IsOptional()
  @IsNumber()
  a_fireRange2?: number;

  @IsOptional()
  @IsNumber()
  a_minRange?: number;

  @IsOptional()
  @IsInt()
  a_targetType?: number;

  @IsOptional()
  @IsInt()
  a_targetNum?: number;

  @IsOptional()
  @IsInt()
  a_useState?: number;

  @IsOptional()
  @IsInt()
  a_useWeaponType0?: number;

  @IsOptional()
  @IsInt()
  a_useWeaponType1?: number;

  @IsOptional()
  @IsInt()
  a_use_needWearingType?: number;

  @IsOptional()
  @IsInt()
  a_useMagicIndex1?: number;

  @IsOptional()
  @IsInt()
  a_useMagicLevel1?: number;

  @IsOptional()
  @IsInt()
  a_useMagicIndex2?: number;

  @IsOptional()
  @IsInt()
  a_useMagicLevel2?: number;

  @IsOptional()
  @IsInt()
  a_useMagicIndex3?: number;

  @IsOptional()
  @IsInt()
  a_useMagicLevel3?: number;

  @IsOptional()
  @IsInt()
  a_appState?: number;

  @IsOptional()
  @IsInt()
  a_appWeaponType0?: number;

  @IsOptional()
  @IsInt()
  a_appWeaponType1?: number;

  @IsOptional()
  @IsInt()
  a_app_needWearingType?: number;

  @IsOptional()
  @IsInt()
  a_readyTime?: number;

  @IsOptional()
  @IsInt()
  a_stillTime?: number;

  @IsOptional()
  @IsInt()
  a_fireTime?: number;

  @IsOptional()
  @IsInt()
  a_reuseTime?: number;

  @IsOptional()
  @IsString()
  a_cd_ra?: string;

  @IsOptional()
  @IsString()
  a_cd_re?: string;

  @IsOptional()
  @IsString()
  a_cd_sa?: string;

  @IsOptional()
  @IsString()
  a_cd_fa?: string;

  @IsOptional()
  @IsString()
  a_cd_fe0?: string;

  @IsOptional()
  @IsString()
  a_cd_fe1?: string;

  @IsOptional()
  @IsString()
  a_cd_fe2?: string;

  @IsOptional()
  @IsInt()
  a_cd_fot?: number;

  @IsOptional()
  @IsNumber()
  a_cd_fos?: number;

  @IsOptional()
  @IsNumber()
  a_cd_ox?: number;

  @IsOptional()
  @IsNumber()
  a_cd_oz?: number;

  @IsOptional()
  @IsNumber()
  a_cd_oh?: number;

  @IsOptional()
  @IsInt()
  a_cd_oc?: number;

  @IsOptional()
  @IsInt()
  a_cd_fdc?: number;

  @IsOptional()
  @IsNumber()
  a_cd_fd0?: number;

  @IsOptional()
  @IsNumber()
  a_cd_fd1?: number;

  @IsOptional()
  @IsNumber()
  a_cd_fd2?: number;

  @IsOptional()
  @IsNumber()
  a_cd_fd3?: number;

  @IsOptional()
  @IsNumber()
  a_cd_dd?: number;

  @IsOptional()
  @IsString()
  a_cd_fe_after?: string;

  @IsOptional()
  @IsString()
  a_cd_fe_after2?: string;

  @IsOptional()
  @IsString()
  a_client_description?: string;

  @IsOptional()
  @IsString()
  a_client_description_twn?: string;

  @IsOptional()
  @IsString()
  a_client_description_chn?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_twn?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_chn?: string;

  @IsOptional()
  @IsInt()
  a_client_icon_texid?: number;

  @IsOptional()
  @IsInt()
  a_client_icon_row?: number;

  @IsOptional()
  @IsInt()
  a_client_icon_col?: number;

  @IsOptional()
  @IsString()
  a_cd_ra2?: string;

  @IsOptional()
  @IsString()
  a_cd_re2?: string;

  @IsOptional()
  @IsString()
  a_cd_sa2?: string;

  @IsOptional()
  @IsString()
  a_cd_fa2?: string;

  @IsOptional()
  @IsString()
  a_cd_fe3?: string;

  @IsOptional()
  @IsString()
  a_cd_fe4?: string;

  @IsOptional()
  @IsString()
  a_cd_fe5?: string;

  @IsOptional()
  @IsInt()
  a_cd_fot2?: number;

  @IsOptional()
  @IsNumber()
  a_cd_fos2?: number;

  @IsOptional()
  @IsNumber()
  a_cd_ox2?: number;

  @IsOptional()
  @IsNumber()
  a_cd_oz2?: number;

  @IsOptional()
  @IsNumber()
  a_cd_oh2?: number;

  @IsOptional()
  @IsInt()
  a_cd_oc2?: number;

  @IsOptional()
  @IsInt()
  a_cd_fdc2?: number;

  @IsOptional()
  @IsNumber()
  a_cd_fd4?: number;

  @IsOptional()
  @IsNumber()
  a_cd_fd5?: number;

  @IsOptional()
  @IsNumber()
  a_cd_fd6?: number;

  @IsOptional()
  @IsNumber()
  a_cd_fd7?: number;

  @IsOptional()
  @IsNumber()
  a_cd_dd2?: number;

  @IsOptional()
  @IsInt()
  a_selfparam?: number;

  @IsOptional()
  @IsInt()
  a_targetparam?: number;

  @IsOptional()
  @IsInt()
  a_soul_consum?: number;

  @IsOptional()
  @IsInt()
  a_summon_idx?: number;

  @IsOptional()
  @IsString()
  a_name_thai?: string;

  @IsOptional()
  @IsString()
  a_client_description_thai?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_thai?: string;

  @IsOptional()
  @IsString()
  a_name_thai_eng?: string;

  @IsOptional()
  @IsString()
  a_client_description_thai_eng?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_thai_eng?: string;

  @IsOptional()
  @IsString()
  a_name_jpn?: string;

  @IsOptional()
  @IsString()
  a_client_description_jpn?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_jpn?: string;

  @IsOptional()
  @IsInt()
  a_sorcerer_flag?: number;

  @IsOptional()
  @IsString()
  a_name_mal?: string;

  @IsOptional()
  @IsString()
  a_client_description_mal?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_mal?: string;

  @IsOptional()
  @IsString()
  a_name_mal_eng?: string;

  @IsOptional()
  @IsString()
  a_client_description_mal_eng?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_mal_eng?: string;

  @IsOptional()
  @IsString()
  a_name_usa?: string;

  @IsOptional()
  @IsString()
  a_client_description_usa?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_usa?: string;

  @IsOptional()
  @IsString()
  a_name_brz?: string;

  @IsOptional()
  @IsString()
  a_client_description_brz?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_brz?: string;

  @IsOptional()
  @IsString()
  a_name_hk?: string;

  @IsOptional()
  @IsString()
  a_client_description_hk?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_hk?: string;

  @IsOptional()
  @IsString()
  a_client_description_hk_eng?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_hk_eng?: string;

  @IsOptional()
  @IsString()
  a_name_hk_eng?: string;

  @IsOptional()
  @IsString()
  a_name_ger?: string;

  @IsOptional()
  @IsString()
  a_client_description_ger?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_ger?: string;

  @IsOptional()
  @IsInt()
  a_apet_index?: number;

  @IsOptional()
  @IsString()
  a_name_spn?: string;

  @IsOptional()
  @IsString()
  a_client_description_spn?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_spn?: string;

  @IsOptional()
  @IsString()
  a_name_frc?: string;

  @IsOptional()
  @IsString()
  a_client_description_frc?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_frc?: string;

  @IsOptional()
  @IsString()
  a_name_pld?: string;

  @IsOptional()
  @IsString()
  a_client_description_pld?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_pld?: string;

  @IsOptional()
  @IsString()
  a_name_rus?: string;

  @IsOptional()
  @IsString()
  a_client_description_rus?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_rus?: string;

  @IsOptional()
  @IsString()
  a_name_tur?: string;

  @IsOptional()
  @IsString()
  a_client_description_tur?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_tur?: string;

  @IsOptional()
  @IsString()
  a_name_spn2?: string;

  @IsOptional()
  @IsString()
  a_client_description_spn2?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_spn2?: string;

  @IsOptional()
  @IsString()
  a_name_frc2?: string;

  @IsOptional()
  @IsString()
  a_client_description_frc2?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_frc2?: string;

  @IsOptional()
  @IsString()
  a_name_ita?: string;

  @IsOptional()
  @IsString()
  a_client_description_ita?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_ita?: string;

  @IsOptional()
  @IsString()
  a_name_mex?: string;

  @IsOptional()
  @IsString()
  a_client_description_mex?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_mex?: string;

  @IsOptional()
  @IsString()
  a_name_nld?: string;

  @IsOptional()
  @IsString()
  a_client_description_nld?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_nld?: string;

  @IsOptional()
  @IsString()
  a_name_uk?: string;

  @IsOptional()
  @IsString()
  a_client_description_uk?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_uk?: string;

  @IsOptional()
  @IsString()
  a_allowzone?: string;

  @IsOptional()
  @IsString()
  a_name_dev?: string;

  @IsOptional()
  @IsString()
  a_client_description_dev?: string;

  @IsOptional()
  @IsString()
  a_client_tooltip_dev?: string;

}

export class CreateTSkillDto extends TSkillDtoBase {}
export class UpdateTSkillDto extends PartialType(TSkillDtoBase) {}
