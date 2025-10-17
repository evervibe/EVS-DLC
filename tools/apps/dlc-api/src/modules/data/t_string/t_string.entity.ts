import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('t_string')
export class TStringEntity {
  @PrimaryColumn({ type: 'int' })
  a_index: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_usa: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_ger: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_spn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_frc: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_rus: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_twn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_chn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_thai: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_thai_eng: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_twn2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_jpn: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_mal: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_mal_eng: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_brz: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_hk: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_hk_eng: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_pld: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_tur: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_spn2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_frc2: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_ita: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_mex: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_nld: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_uk: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  a_string_dev: string;
}
