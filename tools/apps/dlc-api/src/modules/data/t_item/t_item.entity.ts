import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_item')
export class TItemEntity {
  @PrimaryGeneratedColumn()
  a_index: number;

  @Column({ type: 'int', default: 0 })
  a_type_idx: number;

  @Column({ type: 'int', default: 0 })
  a_subtype_idx: number;

  @Column({ type: 'int', default: 0 })
  a_enable: number;

  @Column({ type: 'varchar', length: 60, default: '' })
  a_name_usa: string;

  @Column({ type: 'varchar', length: 60, default: '' })
  a_name_ger: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_usa: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_ger: string;

  @Column({ type: 'varchar', length: 60, default: '' })
  a_name: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_twn: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_chn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_twn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_chn: string;

  @Column({ type: 'int', default: 0 })
  a_job_flag: number;

  @Column({ type: 'bigint', default: 0 })
  a_flag: number;

  @Column({ type: 'tinyint', default: -1 })
  a_wearing: number;

  @Column({ type: 'int', default: 0 })
  a_num_0: number;

  @Column({ type: 'int', default: 0 })
  a_num_1: number;

  @Column({ type: 'int', default: 0 })
  a_num_2: number;

  @Column({ type: 'int', default: 0 })
  a_num_3: number;

  @Column({ type: 'int', default: 0 })
  a_num_4: number;

  @Column({ type: 'int', default: 0 })
  a_num_5: number;

  @Column({ type: 'int', default: 0 })
  a_num_6: number;

  @Column({ type: 'int', default: 0 })
  a_num_7: number;

  @Column({ type: 'int', default: 0 })
  a_num_8: number;

  @Column({ type: 'int', default: 0 })
  a_num_9: number;

  @Column({ type: 'int', default: 0 })
  a_level: number;

  @Column({ type: 'int', default: 0 })
  a_level2: number;

  @Column({ type: 'int', default: 0 })
  a_weight: number;

  @Column({ type: 'int', default: 0 })
  a_price: number;

  @Column({ type: 'int', default: -1 })
  a_max_use: number;

  @Column({ type: 'int', default: 0 })
  a_drop_prob_10: number;

  @Column({ type: 'int', default: -1 })
  a_need_item0: number;

  @Column({ type: 'int', default: -1 })
  a_need_item1: number;

  @Column({ type: 'int', default: -1 })
  a_need_item2: number;

  @Column({ type: 'int', default: -1 })
  a_need_item3: number;

  @Column({ type: 'int', default: -1 })
  a_need_item4: number;

  @Column({ type: 'int', default: -1 })
  a_need_item5: number;

  @Column({ type: 'int', default: -1 })
  a_need_item6: number;

  @Column({ type: 'int', default: -1 })
  a_need_item7: number;

  @Column({ type: 'int', default: -1 })
  a_need_item8: number;

  @Column({ type: 'int', default: -1 })
  a_need_item9: number;

  @Column({ type: 'smallint', default: 0 })
  a_need_item_count0: number;

  @Column({ type: 'smallint', default: 0 })
  a_need_item_count1: number;

  @Column({ type: 'smallint', default: 0 })
  a_need_item_count2: number;

  @Column({ type: 'smallint', default: 0 })
  a_need_item_count3: number;

  @Column({ type: 'smallint', default: 0 })
  a_need_item_count4: number;

  @Column({ type: 'smallint', default: 0 })
  a_need_item_count5: number;

  @Column({ type: 'smallint', default: 0 })
  a_need_item_count6: number;

  @Column({ type: 'smallint', default: 0 })
  a_need_item_count7: number;

  @Column({ type: 'smallint', default: 0 })
  a_need_item_count8: number;

  @Column({ type: 'smallint', default: 0 })
  a_need_item_count9: number;

  @Column({ type: 'int', default: -1 })
  a_need_sskill: number;

  @Column({ type: 'tinyint', default: 0 })
  a_need_sskill_level: number;

  @Column({ type: 'int', default: -1 })
  a_need_sskill2: number;

  @Column({ type: 'tinyint', default: 0 })
  a_need_sskill_level2: number;

  @Column({ type: 'int', default: 0 })
  a_zone_flag: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_file_smc: string;

  @Column({ type: 'tinyint', default: -1 })
  a_texture_id: number;

  @Column({ type: 'tinyint', default: -1 })
  a_texture_row: number;

  @Column({ type: 'tinyint', default: -1 })
  a_texture_col: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  b_todo_delete: number;

  @Column({ type: 'int', default: 0 })
  a_set_0: number;

  @Column({ type: 'int', default: 0 })
  a_set_1: number;

  @Column({ type: 'int', default: 0 })
  a_set_2: number;

  @Column({ type: 'int', default: 0 })
  a_set_3: number;

  @Column({ type: 'int', default: 0 })
  a_set_4: number;

  @Column({ type: 'tinyint', default: -1 })
  a_set: number;

  @Column({ type: 'int', default: 0 })
  a_grade: number;

  @Column({ type: 'int', default: -1 })
  a_fame: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_thai: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_thai: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_thai_eng: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_thai_eng: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_twn2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_twn2: string;

  @Column({ type: 'int', default: 0 })
  a_price_twn2: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_jpn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_jpn: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_mal: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_mal: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_mal_eng: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_mal_eng: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_brz: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_brz: string;

  @Column({ type: 'int', default: -1 })
  a_rare_index_0: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_1: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_2: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_3: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_4: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_5: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_6: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_7: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_8: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_9: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_10: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_11: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_12: number;

  @Column({ type: 'int', default: -1 })
  a_rare_index_13: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_0: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_1: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_2: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_3: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_4: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_5: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_6: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_7: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_8: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_9: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_10: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_11: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_12: number;

  @Column({ type: 'int', default: 0 })
  a_rare_prob_13: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_hk: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_hk: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_hk_eng: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_hk_eng: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  a_effect_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  a_attack_effect_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  a_damage_effect_name: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_spn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_spn: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_frc: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_frc: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_pld: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_pld: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_rus: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_rus: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_tur: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_tur: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_spn2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_spn2: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_frc2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_frc2: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_ita: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_ita: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_mex: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_mex: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_nld: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_nld: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_uk: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_uk: string;

  @Column({ type: 'int', default: 0 })
  a_quest_trigger_count: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_quest_trigger_ids: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_dev: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_descr_dev: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_origin_variation1: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_origin_variation2: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_origin_variation3: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_origin_variation4: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_origin_variation5: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_origin_variation6: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_origin_variation7: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_origin_variation8: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_origin_variation9: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_origin_variation10: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_rvr_value: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_rvr_grade: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  a_durability: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  a_castle_war: number;
}
