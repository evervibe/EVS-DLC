import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TSkillEntity } from '../t_skill/t_skill.entity';

@Entity('t_skilllevel')
export class TSkilllevelEntity {
  @PrimaryColumn({ type: 'int' })
  a_index: number;

  @ManyToOne(() => TSkillEntity, (skill) => skill.levels)
  @JoinColumn({ name: 'a_index', referencedColumnName: 'a_index' })
  skill: TSkillEntity;

  @Column({ type: 'tinyint', default: 0 })
  a_level: number;

  @Column({ type: 'int', default: 0 })
  a_needHP: number;

  @Column({ type: 'int', default: 0 })
  a_needMP: number;

  @Column({ type: 'int', default: 0 })
  a_needGP: number;

  @Column({ type: 'int', default: 0 })
  a_durtime: number;

  @Column({ type: 'int', default: 0 })
  a_dummypower: number;

  @Column({ type: 'int', default: -1 })
  a_needItemIndex1: number;

  @Column({ type: 'int', default: 0 })
  a_needItemCount1: number;

  @Column({ type: 'int', default: -1 })
  a_needItemIndex2: number;

  @Column({ type: 'int', default: 0 })
  a_needItemCount2: number;

  @Column({ type: 'int', default: 0 })
  a_learnLevel: number;

  @Column({ type: 'int', default: 0 })
  a_challenger: number;

  @Column({ type: 'int', default: 0 })
  a_learnSP: number;

  @Column({ type: 'int', default: 0 })
  a_learnSkillIndex1: number;

  @Column({ type: 'tinyint', default: 0 })
  a_learnSkillLevel1: number;

  @Column({ type: 'int', default: 0 })
  a_learnSkillIndex2: number;

  @Column({ type: 'tinyint', default: 0 })
  a_learnSkillLevel2: number;

  @Column({ type: 'int', default: 0 })
  a_learnSkillIndex3: number;

  @Column({ type: 'tinyint', default: 0 })
  a_learnSkillLevel3: number;

  @Column({ type: 'int', default: 0 })
  a_learnItemIndex1: number;

  @Column({ type: 'int', default: 0 })
  a_learnItemCount1: number;

  @Column({ type: 'int', default: 0 })
  a_learnItemIndex2: number;

  @Column({ type: 'int', default: 0 })
  a_learnItemCount2: number;

  @Column({ type: 'int', default: 0 })
  a_learnItemIndex3: number;

  @Column({ type: 'int', default: 0 })
  a_learnItemCount3: number;

  @Column({ type: 'int', default: -1 })
  a_appMagicIndex1: number;

  @Column({ type: 'tinyint', default: 0 })
  a_appMagicLevel1: number;

  @Column({ type: 'int', default: -1 })
  a_appMagicIndex2: number;

  @Column({ type: 'tinyint', default: 0 })
  a_appMagicLevel2: number;

  @Column({ type: 'int', default: -1 })
  a_appMagicIndex3: number;

  @Column({ type: 'tinyint', default: 0 })
  a_appMagicLevel3: number;

  @Column({ type: 'int', default: 0 })
  a_magicIndex1: number;

  @Column({ type: 'tinyint', default: 0 })
  a_magicLevel1: number;

  @Column({ type: 'int', default: 0 })
  a_magicIndex2: number;

  @Column({ type: 'tinyint', default: 0 })
  a_magicLevel2: number;

  @Column({ type: 'int', default: 0 })
  a_magicIndex3: number;

  @Column({ type: 'tinyint', default: 0 })
  a_magicLevel3: number;

  @Column({ type: 'int', default: 0 })
  a_learnstr: number;

  @Column({ type: 'int', default: 0 })
  a_learndex: number;

  @Column({ type: 'int', default: 0 })
  a_learnint: number;

  @Column({ type: 'int', default: 0 })
  a_learncon: number;

  @Column({ type: 'int', default: 0 })
  a_hate: number;

  @Column({ type: 'int', default: 0 })
  a_learnGP: number;

  @Column({ type: 'int', default: 0 })
  a_use_count: number;

  @Column({ type: 'int', default: 0 })
  a_targetNum: number;
}
