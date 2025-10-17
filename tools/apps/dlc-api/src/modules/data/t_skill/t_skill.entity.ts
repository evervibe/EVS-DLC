import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { TSkilllevelEntity } from '../t_skilllevel/t_skilllevel.entity';

@Entity('t_skill')
export class TSkillEntity {
  @PrimaryColumn({ type: 'int' })
  a_index: number;

  @OneToMany(() => TSkilllevelEntity, (level) => level.skill)
  levels: TSkilllevelEntity[];

  @Column({ type: 'int', default: 999 })
  a_job: number;

  @Column({ type: 'int', default: 0 })
  a_job2: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_twn: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_chn: string;

  @Column({ type: 'tinyint', default: 0 })
  a_type: number;

  @Column({ type: 'int', default: 0 })
  a_flag: number;

  @Column({ type: 'tinyint', default: 1 })
  a_maxLevel: number;

  @Column({ type: 'float', default: 0 })
  a_appRange: number;

  @Column({ type: 'float', default: 2 })
  a_fireRange: number;

  @Column({ type: 'float', default: 0 })
  a_fireRange2: number;

  @Column({ type: 'float', default: 0 })
  a_minRange: number;

  @Column({ type: 'tinyint', default: 0 })
  a_targetType: number;

  @Column({ type: 'tinyint', default: 1 })
  a_targetNum: number;

  @Column({ type: 'int', default: 0 })
  a_useState: number;

  @Column({ type: 'int', default: -1 })
  a_useWeaponType0: number;

  @Column({ type: 'int', default: -1 })
  a_useWeaponType1: number;

  @Column({ type: 'int', default: -1 })
  a_use_needWearingType: number;

  @Column({ type: 'int', default: -1 })
  a_useMagicIndex1: number;

  @Column({ type: 'tinyint', default: 0 })
  a_useMagicLevel1: number;

  @Column({ type: 'int', default: -1 })
  a_useMagicIndex2: number;

  @Column({ type: 'tinyint', default: 0 })
  a_useMagicLevel2: number;

  @Column({ type: 'int', default: -1 })
  a_useMagicIndex3: number;

  @Column({ type: 'tinyint', default: 0 })
  a_useMagicLevel3: number;

  @Column({ type: 'int', default: 0 })
  a_appState: number;

  @Column({ type: 'int', default: -1 })
  a_appWeaponType0: number;

  @Column({ type: 'int', default: -1 })
  a_appWeaponType1: number;

  @Column({ type: 'int', default: -1 })
  a_app_needWearingType: number;

  @Column({ type: 'int', default: 0 })
  a_readyTime: number;

  @Column({ type: 'int', default: 0 })
  a_stillTime: number;

  @Column({ type: 'int', default: 0 })
  a_fireTime: number;

  @Column({ type: 'int', default: 0 })
  a_reuseTime: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_ra: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_re: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_sa: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_fa: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_fe0: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_fe1: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_fe2: string;

  @Column({ type: 'tinyint', default: 0 })
  a_cd_fot: number;

  @Column({ type: 'float', default: 0 })
  a_cd_fos: number;

  @Column({ type: 'float', default: 0 })
  a_cd_ox: number;

  @Column({ type: 'float', default: 0 })
  a_cd_oz: number;

  @Column({ type: 'float', default: 0 })
  a_cd_oh: number;

  @Column({ type: 'tinyint', default: 0 })
  a_cd_oc: number;

  @Column({ type: 'tinyint', default: 0 })
  a_cd_fdc: number;

  @Column({ type: 'float', default: 0 })
  a_cd_fd0: number;

  @Column({ type: 'float', default: 0 })
  a_cd_fd1: number;

  @Column({ type: 'float', default: 0 })
  a_cd_fd2: number;

  @Column({ type: 'float', default: 0 })
  a_cd_fd3: number;

  @Column({ type: 'float', default: 0 })
  a_cd_dd: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_fe_after: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_fe_after2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_twn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_chn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_twn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_chn: string;

  @Column({ type: 'int', default: 0 })
  a_client_icon_texid: number;

  @Column({ type: 'int', default: 0 })
  a_client_icon_row: number;

  @Column({ type: 'int', default: 0 })
  a_client_icon_col: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_ra2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_re2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_sa2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_fa2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_fe3: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_fe4: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_cd_fe5: string;

  @Column({ type: 'tinyint', default: 0 })
  a_cd_fot2: number;

  @Column({ type: 'float', default: 0 })
  a_cd_fos2: number;

  @Column({ type: 'float', default: 0 })
  a_cd_ox2: number;

  @Column({ type: 'float', default: 0 })
  a_cd_oz2: number;

  @Column({ type: 'float', default: 0 })
  a_cd_oh2: number;

  @Column({ type: 'tinyint', default: 0 })
  a_cd_oc2: number;

  @Column({ type: 'tinyint', default: 0 })
  a_cd_fdc2: number;

  @Column({ type: 'float', default: 0 })
  a_cd_fd4: number;

  @Column({ type: 'float', default: 0 })
  a_cd_fd5: number;

  @Column({ type: 'float', default: 0 })
  a_cd_fd6: number;

  @Column({ type: 'float', default: 0 })
  a_cd_fd7: number;

  @Column({ type: 'float', default: 0 })
  a_cd_dd2: number;

  @Column({ type: 'int', default: 0 })
  a_selfparam: number;

  @Column({ type: 'int', default: 0 })
  a_targetparam: number;

  @Column({ type: 'int', default: 0 })
  a_soul_consum: number;

  @Column({ type: 'int', nullable: true, default: -1 })
  a_summon_idx: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_thai: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_thai: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_thai: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_thai_eng: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_thai_eng: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_thai_eng: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_jpn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_jpn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_jpn: string;

  @Column({ type: 'int', default: 0 })
  a_sorcerer_flag: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_mal: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_mal: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_mal: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_mal_eng: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_mal_eng: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_mal_eng: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_usa: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_usa: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_usa: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_brz: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_brz: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_brz: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_hk: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_hk: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_hk: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_hk_eng: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_hk_eng: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_hk_eng: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_ger: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_ger: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_ger: string;

  @Column({ type: 'int', default: 0 })
  a_apet_index: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_spn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_spn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_spn: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_frc: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_frc: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_frc: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_pld: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_pld: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_pld: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_rus: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_rus: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_rus: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_tur: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_tur: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_tur: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_spn2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_spn2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_spn2: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_frc2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_frc2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_frc2: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_ita: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_ita: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_ita: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_mex: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_mex: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_mex: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_nld: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_nld: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_nld: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_uk: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_uk: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_uk: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_allowzone: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  a_name_dev: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_description_dev: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_client_tooltip_dev: string;
}
