import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_item')
export class TItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: 'int', nullable: true })
  type?: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  level?: number;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

}
