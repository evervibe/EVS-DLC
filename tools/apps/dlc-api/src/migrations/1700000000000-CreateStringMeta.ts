import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * Migration to create dlc_string_meta table for workflow tracking
 */
export class CreateStringMeta1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if table already exists
    const tableExists = await queryRunner.hasTable('dlc_string_meta');
    if (tableExists) {
      console.log('Table dlc_string_meta already exists, skipping creation');
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'dlc_string_meta',
        columns: [
          {
            name: 'a_index',
            type: 'int',
            isPrimary: true,
            comment: 'References t_string.a_index',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'review', 'approved'],
            default: "'draft'",
            isNullable: false,
          },
          {
            name: 'version',
            type: 'int',
            default: 1,
            isNullable: false,
          },
          {
            name: 'hash',
            type: 'char',
            length: '40',
            isNullable: false,
            comment: 'SHA1 hash of string content',
          },
          {
            name: 'updated_by',
            type: 'varchar',
            length: '64',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'datetime',
            precision: 6,
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
            isNullable: false,
          },
          {
            name: 'approved_by',
            type: 'varchar',
            length: '64',
            isNullable: true,
          },
          {
            name: 'approved_at',
            type: 'datetime',
            precision: 6,
            isNullable: true,
          },
          {
            name: 'rejected_reason',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'dlc_string_meta',
      new TableIndex({
        name: 'IDX_dlc_string_meta_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'dlc_string_meta',
      new TableIndex({
        name: 'IDX_dlc_string_meta_updated_at',
        columnNames: ['updated_at'],
      }),
    );

    console.log('Created dlc_string_meta table with indexes');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    const tableExists = await queryRunner.hasTable('dlc_string_meta');
    if (tableExists) {
      await queryRunner.dropIndex('dlc_string_meta', 'IDX_dlc_string_meta_updated_at');
      await queryRunner.dropIndex('dlc_string_meta', 'IDX_dlc_string_meta_status');
      await queryRunner.dropTable('dlc_string_meta');
      console.log('Dropped dlc_string_meta table');
    }
  }
}
