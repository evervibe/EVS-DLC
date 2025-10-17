import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_string')
export class TStringEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column({ type: 'text', nullable: true })
  value?: string;

  @Column({ nullable: true, default: 'en' })
  language?: string;

}
