import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_skilllevel')
export class TSkilllevelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  skill_id: number;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  required_exp?: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  effect_value?: number;

}
