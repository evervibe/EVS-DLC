import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_character')
export class TCharacterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: 'int', nullable: true })
  class_type?: number;

  @Column({ type: 'int', nullable: true, default: 100 })
  base_hp?: number;

  @Column({ type: 'int', nullable: true, default: 50 })
  base_mp?: number;

}
