import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, IsNull, Not } from 'typeorm';
import { createHash } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { TStringEntity } from '../data/t_string/t_string.entity';
import { StringMetaEntity } from '../data/string-meta/string-meta.entity';
import { CacheService } from '../../core/cache/cache.service';
import { createLogger } from '../../common/utils';
import { ApiError } from '../../common/errors';
import {
  LANG_MAP,
  Locale,
  getAllLocales,
  validateStringValue,
  MAX_LEN,
  WorkflowStatus,
} from '@evs-dlc/shared-lib';
import {
  StringsListQueryDto,
  UpdateStringValuesDto,
  RejectStringDto,
  ExportPublishDto,
} from './dto/strings.dto';

interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface StringWithMeta extends TStringEntity {
  meta?: StringMetaEntity;
}

interface DiffRow {
  line: number;
  a_index: number;
  action: 'add' | 'update' | 'skip' | 'error';
  diff?: Record<string, [string, string]>;
  reason?: string;
}

export interface BulkImportResult {
  summary: {
    added: number;
    updated: number;
    skipped: number;
    errors: number;
  };
  rows: DiffRow[];
}

@Injectable()
export class StringsService {
  private readonly logger = createLogger(StringsService.name);

  constructor(
    @InjectRepository(TStringEntity)
    private readonly stringRepo: Repository<TStringEntity>,
    @InjectRepository(StringMetaEntity)
    private readonly metaRepo: Repository<StringMetaEntity>,
    private readonly cache: CacheService,
  ) {}

  /**
   * List strings with advanced filtering
   */
  async findAll(query: StringsListQueryDto): Promise<PaginatedResult<StringWithMeta>> {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;
    const orderBy = query.orderBy ?? 'a_index';
    const orderDir = query.orderDir ?? 'ASC';

    this.logger.debug('Fetching strings list', { query });

    const qb = this.stringRepo
      .createQueryBuilder('str')
      .leftJoinAndMapOne('str.meta', StringMetaEntity, 'meta', 'str.a_index = meta.a_index');

    // Apply text search
    if (query.q) {
      this.applyTextSearch(qb, query.q);
    }

    // Filter by status
    if (query.status) {
      qb.andWhere('meta.status = :status', { status: query.status });
    }

    // Filter by missing language
    if (query.langMissing) {
      const column = LANG_MAP[query.langMissing];
      qb.andWhere(`(str.${column} IS NULL OR str.${column} = '')`);
    }

    // Apply ordering
    qb.orderBy(`str.${orderBy}`, orderDir);

    // Pagination
    const [data, total] = await qb.take(limit).skip(offset).getManyAndCount();

    return {
      data,
      meta: {
        total,
        limit,
        offset,
      },
    };
  }

  /**
   * Get single string with metadata
   */
  async findOne(id: number): Promise<StringWithMeta> {
    this.logger.debug('Fetching string by id', { id });

    const str = await this.stringRepo
      .createQueryBuilder('str')
      .leftJoinAndMapOne('str.meta', StringMetaEntity, 'meta', 'str.a_index = meta.a_index')
      .where('str.a_index = :id', { id })
      .getOne();

    if (!str) {
      throw ApiError.notFound('String not found', 'STRING_NOT_FOUND');
    }

    return str;
  }

  /**
   * Update string values and set status to draft
   */
  async update(id: number, values: UpdateStringValuesDto, userId: string): Promise<StringWithMeta> {
    this.logger.debug('Updating string', { id, userId });

    // Validate the string exists
    const existing = await this.stringRepo.findOne({ where: { a_index: id } as any });
    if (!existing) {
      throw ApiError.notFound('String not found', 'STRING_NOT_FOUND');
    }

    // Validate all values
    const updates: Partial<TStringEntity> = {};
    for (const [key, value] of Object.entries(values)) {
      // Check if it's a valid language column
      if (!Object.values(LANG_MAP).includes(key as any)) {
        continue; // Skip invalid columns
      }

      if (typeof value !== 'string') {
        continue;
      }

      // Validate value
      const validation = validateStringValue(value);
      if (!validation.valid) {
        throw ApiError.badRequest(
          `Validation failed for ${key}: ${validation.errors.join(', ')}`,
          'VALIDATION_FAILED',
        );
      }

      updates[key as keyof TStringEntity] = value as never;
    }

    if (Object.keys(updates).length === 0) {
      throw ApiError.badRequest('No valid updates provided', 'NO_UPDATES');
    }

    // Update the string
    await this.stringRepo.update({ a_index: id } as any, updates as any);

    // Update or create metadata
    const hash = this.calculateHash({ ...existing, ...updates });
    let meta = await this.metaRepo.findOne({ where: { a_index: id } });

    if (meta) {
      meta.status = 'draft';
      meta.version += 1;
      meta.hash = hash;
      meta.updated_by = userId;
      meta.updated_at = new Date();
      meta.rejected_reason = null; // Clear rejection reason on new edit
    } else {
      meta = this.metaRepo.create({
        a_index: id,
        status: 'draft',
        version: 1,
        hash,
        updated_by: userId,
        updated_at: new Date(),
      });
    }

    await this.metaRepo.save(meta);
    await this.cache.invalidatePattern('strings:*');

    this.logger.log('Updated string', { id, version: meta.version });
    return this.findOne(id);
  }

  /**
   * Submit string for review
   */
  async submitForReview(id: number, userId: string): Promise<StringWithMeta> {
    this.logger.debug('Submitting string for review', { id, userId });

    let meta = await this.metaRepo.findOne({ where: { a_index: id } });
    if (!meta) {
      // Create meta if doesn't exist
      const str = await this.stringRepo.findOne({ where: { a_index: id } as any });
      if (!str) {
        throw ApiError.notFound('String not found', 'STRING_NOT_FOUND');
      }

      meta = this.metaRepo.create({
        a_index: id,
        status: 'review',
        version: 1,
        hash: this.calculateHash(str),
        updated_by: userId,
        updated_at: new Date(),
      });
    } else {
      meta.status = 'review';
      meta.updated_by = userId;
      meta.updated_at = new Date();
    }

    await this.metaRepo.save(meta);
    await this.cache.invalidatePattern('strings:*');

    this.logger.log('Submitted string for review', { id });
    return this.findOne(id);
  }

  /**
   * Approve string
   */
  async approve(id: number, userId: string): Promise<StringWithMeta> {
    this.logger.debug('Approving string', { id, userId });

    const meta = await this.metaRepo.findOne({ where: { a_index: id } });
    if (!meta) {
      throw ApiError.notFound('String metadata not found', 'META_NOT_FOUND');
    }

    meta.status = 'approved';
    meta.approved_by = userId;
    meta.approved_at = new Date();
    meta.rejected_reason = null;

    await this.metaRepo.save(meta);
    await this.cache.invalidatePattern('strings:*');

    this.logger.log('Approved string', { id });
    return this.findOne(id);
  }

  /**
   * Reject string
   */
  async reject(id: number, userId: string, dto: RejectStringDto): Promise<StringWithMeta> {
    this.logger.debug('Rejecting string', { id, userId });

    const meta = await this.metaRepo.findOne({ where: { a_index: id } });
    if (!meta) {
      throw ApiError.notFound('String metadata not found', 'META_NOT_FOUND');
    }

    meta.status = 'draft';
    meta.rejected_reason = dto.reason;
    meta.updated_by = userId;
    meta.updated_at = new Date();

    await this.metaRepo.save(meta);
    await this.cache.invalidatePattern('strings:*');

    this.logger.log('Rejected string', { id, reason: dto.reason });
    return this.findOne(id);
  }

  /**
   * Bulk import from CSV data (dry-run or commit)
   */
  async bulkImport(rows: any[], dryRun: boolean, userId: string): Promise<BulkImportResult> {
    this.logger.debug('Processing bulk import', { rowCount: rows.length, dryRun });

    const result: BulkImportResult = {
      summary: { added: 0, updated: 0, skipped: 0, errors: 0 },
      rows: [],
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const line = i + 2; // Account for header row

      try {
        const a_index = parseInt(row.a_index, 10);
        if (isNaN(a_index)) {
          result.summary.errors++;
          result.rows.push({
            line,
            a_index: row.a_index,
            action: 'error',
            reason: 'Invalid a_index',
          });
          continue;
        }

        // Check if string exists
        const existing = await this.stringRepo.findOne({ where: { a_index } as any });
        const isNew = !existing;

        // Validate and collect updates
        const updates: Partial<TStringEntity> = {};
        const validationErrors: string[] = [];

        for (const [key, value] of Object.entries(row)) {
          if (key === 'a_index' || !value) continue;

          // Map locale key to column name if needed
          let columnName = key;
          if (key in LANG_MAP) {
            columnName = LANG_MAP[key as Locale];
          }

          // Check if valid column
          if (!Object.values(LANG_MAP).includes(columnName as any)) {
            continue;
          }

          const stringValue = String(value);
          const validation = validateStringValue(stringValue);
          if (!validation.valid) {
            validationErrors.push(...validation.errors);
            continue;
          }

          updates[columnName as keyof TStringEntity] = stringValue as never;
        }

        if (validationErrors.length > 0) {
          result.summary.errors++;
          result.rows.push({
            line,
            a_index,
            action: 'error',
            reason: validationErrors.join('; '),
          });
          continue;
        }

        if (Object.keys(updates).length === 0) {
          result.summary.skipped++;
          result.rows.push({
            line,
            a_index,
            action: 'skip',
            reason: 'No valid language columns',
          });
          continue;
        }

        // Build diff
        const diff: Record<string, [string, string]> = {};
        if (existing) {
          for (const [key, newVal] of Object.entries(updates)) {
            const oldVal = existing[key as keyof TStringEntity] as string;
            if (oldVal !== newVal) {
              diff[key] = [oldVal || '', newVal as string];
            }
          }
        }

        if (!dryRun) {
          if (isNew) {
            const entity = this.stringRepo.create({ a_index, ...updates } as any);
            await this.stringRepo.save(entity);
          } else {
            await this.stringRepo.update({ a_index } as any, updates as any);
          }

          // Update metadata
          const hash = this.calculateHash({ ...existing, ...updates } as TStringEntity);
          let meta = await this.metaRepo.findOne({ where: { a_index } });
          if (meta) {
            meta.version += 1;
            meta.hash = hash;
            meta.status = 'draft';
            meta.updated_by = userId;
          } else {
            meta = this.metaRepo.create({
              a_index,
              status: 'draft',
              version: 1,
              hash,
              updated_by: userId,
            });
          }
          await this.metaRepo.save(meta);
        }

        if (isNew) {
          result.summary.added++;
        } else {
          result.summary.updated++;
        }

        result.rows.push({
          line,
          a_index,
          action: isNew ? 'add' : 'update',
          diff: Object.keys(diff).length > 0 ? diff : undefined,
        });
      } catch (error) {
        this.logger.error('Error processing row', error instanceof Error ? error.stack : String(error));
        result.summary.errors++;
        result.rows.push({
          line,
          a_index: row.a_index,
          action: 'error',
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    if (!dryRun) {
      await this.cache.invalidatePattern('strings:*');
    }

    return result;
  }

  /**
   * Get export preview (counts, hash preview)
   */
  async getExportPreview(): Promise<any> {
    this.logger.debug('Getting export preview');

    // Get approved strings only
    const approved = await this.stringRepo
      .createQueryBuilder('str')
      .innerJoin(StringMetaEntity, 'meta', 'str.a_index = meta.a_index AND meta.status = :status', {
        status: 'approved',
      })
      .getMany();

    const locales = getAllLocales();
    const localeCounts: Record<string, number> = {};

    for (const locale of locales) {
      const column = LANG_MAP[locale];
      const count = approved.filter((str) => {
        const val = str[column as keyof TStringEntity];
        return val && String(val).trim() !== '';
      }).length;
      localeCounts[locale] = count;
    }

    // Calculate preview hash
    const previewContent = approved
      .sort((a, b) => a.a_index - b.a_index)
      .map((str) => {
        const values = locales.map((loc) => {
          const col = LANG_MAP[loc];
          return String(str[col as keyof TStringEntity] || '');
        });
        return `${str.a_index}\t${values.join('\t')}`;
      })
      .join('\n');

    const hash = createHash('sha1').update(previewContent).digest('hex');

    return {
      rowCount: approved.length,
      locales,
      localeCounts,
      hash,
      approvedOnly: true,
    };
  }

  /**
   * Publish export - generate .load file and manifest
   */
  async publishExport(dto: ExportPublishDto): Promise<any> {
    this.logger.log('Publishing export', { version: dto.version });

    // Sanitize version to prevent path injection
    const sanitizedVersion = dto.version.replace(/[^a-zA-Z0-9._-]/g, '');
    if (!sanitizedVersion || sanitizedVersion !== dto.version) {
      throw ApiError.badRequest('Invalid version format. Use only alphanumeric characters, dots, dashes, and underscores.', 'INVALID_VERSION');
    }

    // Get approved strings only
    const approved = await this.stringRepo
      .createQueryBuilder('str')
      .innerJoin(StringMetaEntity, 'meta', 'str.a_index = meta.a_index AND meta.status = :status', {
        status: 'approved',
      })
      .orderBy('str.a_index', 'ASC')
      .getMany();

    const locales = getAllLocales();

    // Generate .load content
    const lines = approved.map((str) => {
      const values = locales.map((loc) => {
        const col = LANG_MAP[loc];
        return String(str[col as keyof TStringEntity] || '');
      });
      return `${str.a_index}\t${values.join('\t')}`;
    });

    const loadContent = lines.join('\n');
    const hash = createHash('sha1').update(loadContent).digest('hex');

    // Get git commit (if available)
    let sourceCommit = 'unknown';
    try {
      const { execSync } = require('child_process');
      sourceCommit = execSync('git rev-parse HEAD').toString().trim();
    } catch {
      // Ignore if git not available
    }

    // Create manifest
    const manifest = {
      domain: 'strings',
      version: dto.version,
      generatedAt: new Date().toISOString(),
      rowCount: approved.length,
      locales,
      hash,
      sourceCommit,
      approvedOnly: true,
      notes: dto.notes,
    };

    // Write files
    const exportDir = path.join(process.cwd(), 'infra', 'exports', 'strings', sanitizedVersion);
    await fs.mkdir(exportDir, { recursive: true });

    await fs.writeFile(path.join(exportDir, 'strings.load'), loadContent, 'utf8');
    await fs.writeFile(path.join(exportDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

    this.logger.log('Export published', { version: sanitizedVersion, hash, rowCount: approved.length });

    return {
      success: true,
      version: sanitizedVersion,
      exportDir,
      manifest,
      files: {
        load: path.join(exportDir, 'strings.load'),
        manifest: path.join(exportDir, 'manifest.json'),
      },
    };
  }

  /**
   * Helper: Apply text search across multiple columns
   */
  private applyTextSearch(qb: SelectQueryBuilder<TStringEntity>, search: string) {
    const like = `%${search}%`;
    const conditions = [
      'str.a_index LIKE :like',
      'str.a_string LIKE :like',
      'str.a_string_usa LIKE :like',
      'str.a_string_ger LIKE :like',
      'str.a_string_spn LIKE :like',
    ];
    qb.andWhere(`(${conditions.join(' OR ')})`, { like });
  }

  /**
   * Helper: Calculate hash for string content
   */
  private calculateHash(str: Partial<TStringEntity>): string {
    const locales = getAllLocales();
    const values = locales.map((loc) => {
      const col = LANG_MAP[loc];
      return String(str[col as keyof TStringEntity] || '');
    });
    const content = `${str.a_index}:${values.join('|')}`;
    return createHash('sha1').update(content).digest('hex');
  }
}