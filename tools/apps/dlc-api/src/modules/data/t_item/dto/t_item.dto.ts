import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Max,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class TItemDtoBase {
  @IsDefined()
  @IsInt()
  @Min(0)
  a_type_idx!: number;

  @IsDefined()
  @IsInt()
  @Min(0)
  a_subtype_idx!: number;

  @IsDefined()
  @IsInt()
  @Min(0)
  @Max(1)
  a_enable!: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  a_name_usa!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  a_name_ger?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_descr_usa?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_descr_ger?: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  a_name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  a_descr?: string;

  @IsOptional()
  @IsString()
  a_name_twn?: string;

  @IsOptional()
  @IsString()
  a_name_chn?: string;

  @IsOptional()
  @IsString()
  a_descr_twn?: string;

  @IsOptional()
  @IsString()
  a_descr_chn?: string;

  @IsOptional()
  @IsInt()
  a_job_flag?: number;

  @IsOptional()
  @IsNumber()
  a_flag?: number;

  @IsOptional()
  @IsInt()
  a_wearing?: number;

  @IsOptional()
  @IsInt()
  a_num_0?: number;

  @IsOptional()
  @IsInt()
  a_num_1?: number;

  @IsOptional()
  @IsInt()
  a_num_2?: number;

  @IsOptional()
  @IsInt()
  a_num_3?: number;

  @IsOptional()
  @IsInt()
  a_num_4?: number;

  @IsOptional()
  @IsInt()
  a_num_5?: number;

  @IsOptional()
  @IsInt()
  a_num_6?: number;

  @IsOptional()
  @IsInt()
  a_num_7?: number;

  @IsOptional()
  @IsInt()
  a_num_8?: number;

  @IsOptional()
  @IsInt()
  a_num_9?: number;

  @IsOptional()
  @IsInt()
  a_level?: number;

  @IsOptional()
  @IsInt()
  a_level2?: number;

  @IsOptional()
  @IsInt()
  a_weight?: number;

  @IsOptional()
  @IsInt()
  a_price?: number;

  @IsOptional()
  @IsInt()
  a_max_use?: number;

  @IsOptional()
  @IsInt()
  a_drop_prob_10?: number;

  @IsOptional()
  @IsInt()
  a_need_item0?: number;

  @IsOptional()
  @IsInt()
  a_need_item1?: number;

  @IsOptional()
  @IsInt()
  a_need_item2?: number;

  @IsOptional()
  @IsInt()
  a_need_item3?: number;

  @IsOptional()
  @IsInt()
  a_need_item4?: number;

  @IsOptional()
  @IsInt()
  a_need_item5?: number;

  @IsOptional()
  @IsInt()
  a_need_item6?: number;

  @IsOptional()
  @IsInt()
  a_need_item7?: number;

  @IsOptional()
  @IsInt()
  a_need_item8?: number;

  @IsOptional()
  @IsInt()
  a_need_item9?: number;

  @IsOptional()
  @IsInt()
  a_need_item_count0?: number;

  @IsOptional()
  @IsInt()
  a_need_item_count1?: number;

  @IsOptional()
  @IsInt()
  a_need_item_count2?: number;

  @IsOptional()
  @IsInt()
  a_need_item_count3?: number;

  @IsOptional()
  @IsInt()
  a_need_item_count4?: number;

  @IsOptional()
  @IsInt()
  a_need_item_count5?: number;

  @IsOptional()
  @IsInt()
  a_need_item_count6?: number;

  @IsOptional()
  @IsInt()
  a_need_item_count7?: number;

  @IsOptional()
  @IsInt()
  a_need_item_count8?: number;

  @IsOptional()
  @IsInt()
  a_need_item_count9?: number;

  @IsOptional()
  @IsInt()
  a_need_sskill?: number;

  @IsOptional()
  @IsInt()
  a_need_sskill_level?: number;

  @IsOptional()
  @IsInt()
  a_need_sskill2?: number;

  @IsOptional()
  @IsInt()
  a_need_sskill_level2?: number;

  @IsOptional()
  @IsInt()
  a_zone_flag?: number;

  @IsOptional()
  @IsString()
  a_file_smc?: string;

  @IsOptional()
  @IsInt()
  a_texture_id?: number;

  @IsOptional()
  @IsInt()
  a_texture_row?: number;

  @IsOptional()
  @IsInt()
  a_texture_col?: number;

  @IsOptional()
  @IsInt()
  b_todo_delete?: number;

  @IsOptional()
  @IsInt()
  a_set_0?: number;

  @IsOptional()
  @IsInt()
  a_set_1?: number;

  @IsOptional()
  @IsInt()
  a_set_2?: number;

  @IsOptional()
  @IsInt()
  a_set_3?: number;

  @IsOptional()
  @IsInt()
  a_set_4?: number;

  @IsOptional()
  @IsInt()
  a_set?: number;

  @IsOptional()
  @IsInt()
  a_grade?: number;

  @IsOptional()
  @IsInt()
  a_fame?: number;

  @IsOptional()
  @IsString()
  a_name_thai?: string;

  @IsOptional()
  @IsString()
  a_descr_thai?: string;

  @IsOptional()
  @IsString()
  a_name_thai_eng?: string;

  @IsOptional()
  @IsString()
  a_descr_thai_eng?: string;

  @IsOptional()
  @IsString()
  a_name_twn2?: string;

  @IsOptional()
  @IsString()
  a_descr_twn2?: string;

  @IsOptional()
  @IsInt()
  a_price_twn2?: number;

  @IsOptional()
  @IsString()
  a_name_jpn?: string;

  @IsOptional()
  @IsString()
  a_descr_jpn?: string;

  @IsOptional()
  @IsString()
  a_name_mal?: string;

  @IsOptional()
  @IsString()
  a_descr_mal?: string;

  @IsOptional()
  @IsString()
  a_name_mal_eng?: string;

  @IsOptional()
  @IsString()
  a_descr_mal_eng?: string;

  @IsOptional()
  @IsString()
  a_name_brz?: string;

  @IsOptional()
  @IsString()
  a_descr_brz?: string;

  @IsOptional()
  @IsInt()
  a_rare_index_0?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_1?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_2?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_3?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_4?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_5?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_6?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_7?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_8?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_9?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_10?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_11?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_12?: number;

  @IsOptional()
  @IsInt()
  a_rare_index_13?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_0?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_1?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_2?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_3?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_4?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_5?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_6?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_7?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_8?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_9?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_10?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_11?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_12?: number;

  @IsOptional()
  @IsInt()
  a_rare_prob_13?: number;

  @IsOptional()
  @IsString()
  a_name_hk?: string;

  @IsOptional()
  @IsString()
  a_descr_hk?: string;

  @IsOptional()
  @IsString()
  a_descr_hk_eng?: string;

  @IsOptional()
  @IsString()
  a_name_hk_eng?: string;

  @IsOptional()
  @IsString()
  a_effect_name?: string;

  @IsOptional()
  @IsString()
  a_attack_effect_name?: string;

  @IsOptional()
  @IsString()
  a_damage_effect_name?: string;

  @IsOptional()
  @IsString()
  a_name_spn?: string;

  @IsOptional()
  @IsString()
  a_descr_spn?: string;

  @IsOptional()
  @IsString()
  a_name_frc?: string;

  @IsOptional()
  @IsString()
  a_descr_frc?: string;

  @IsOptional()
  @IsString()
  a_name_pld?: string;

  @IsOptional()
  @IsString()
  a_descr_pld?: string;

  @IsOptional()
  @IsString()
  a_name_rus?: string;

  @IsOptional()
  @IsString()
  a_descr_rus?: string;

  @IsOptional()
  @IsString()
  a_name_tur?: string;

  @IsOptional()
  @IsString()
  a_descr_tur?: string;

  @IsOptional()
  @IsString()
  a_name_spn2?: string;

  @IsOptional()
  @IsString()
  a_descr_spn2?: string;

  @IsOptional()
  @IsString()
  a_name_frc2?: string;

  @IsOptional()
  @IsString()
  a_descr_frc2?: string;

  @IsOptional()
  @IsString()
  a_name_ita?: string;

  @IsOptional()
  @IsString()
  a_descr_ita?: string;

  @IsOptional()
  @IsString()
  a_name_mex?: string;

  @IsOptional()
  @IsString()
  a_descr_mex?: string;

  @IsOptional()
  @IsString()
  a_name_nld?: string;

  @IsOptional()
  @IsString()
  a_descr_nld?: string;

  @IsOptional()
  @IsString()
  a_name_uk?: string;

  @IsOptional()
  @IsString()
  a_descr_uk?: string;

  @IsOptional()
  @IsInt()
  a_quest_trigger_count?: number;

  @IsOptional()
  @IsString()
  a_quest_trigger_ids?: string;

  @IsOptional()
  @IsString()
  a_name_dev?: string;

  @IsOptional()
  @IsString()
  a_descr_dev?: string;

  @IsOptional()
  @IsInt()
  a_origin_variation1?: number;

  @IsOptional()
  @IsInt()
  a_origin_variation2?: number;

  @IsOptional()
  @IsInt()
  a_origin_variation3?: number;

  @IsOptional()
  @IsInt()
  a_origin_variation4?: number;

  @IsOptional()
  @IsInt()
  a_origin_variation5?: number;

  @IsOptional()
  @IsInt()
  a_origin_variation6?: number;

  @IsOptional()
  @IsInt()
  a_origin_variation7?: number;

  @IsOptional()
  @IsInt()
  a_origin_variation8?: number;

  @IsOptional()
  @IsInt()
  a_origin_variation9?: number;

  @IsOptional()
  @IsInt()
  a_origin_variation10?: number;

  @IsOptional()
  @IsInt()
  a_rvr_value?: number;

  @IsOptional()
  @IsInt()
  a_rvr_grade?: number;

  @IsOptional()
  @IsInt()
  a_durability?: number;

  @IsOptional()
  @IsInt()
  a_castle_war?: number;

}

export class CreateTItemDto extends TItemDtoBase {}

export class UpdateTItemDto extends PartialType(TItemDtoBase) {}
