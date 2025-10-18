import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

/**
 * Sidecar metadata table for string workflow tracking
 * Does not have FK constraint to allow legacy MyISAM compatibility
 */
@Entity('dlc_string_meta')
export class StringMetaEntity {
  @PrimaryColumn({ type: 'int', comment: 'References t_string.a_index' })
  a_index: number;

  @Index()
  @Column({
    type: 'enum',
    enum: ['draft', 'review', 'approved'],
    default: 'draft',
    nullable: false,
  })
  status: 'draft' | 'review' | 'approved';

  @Column({ type: 'int', default: 1, nullable: false })
  version: number;

  @Column({ type: 'char', length: 40, nullable: false, comment: 'SHA1 hash of string content' })
  hash: string;

  @Column({ type: 'varchar', length: 64, nullable: false })
  updated_by: string;

  @Index()
  @Column({
    type: 'datetime',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  updated_at: Date;

  @Column({ type: 'varchar', length: 64, nullable: true })
  approved_by: string | null;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  approved_at: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  rejected_reason: string | null;
}
