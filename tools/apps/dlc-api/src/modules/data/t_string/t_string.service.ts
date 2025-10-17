import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TStringEntity } from './t_string.entity';
import { CacheService } from '../../../core/cache/cache.service';
import { createLogger, sanitizeObject, isEmpty } from '../../../common/utils';
import { ApiError } from '../../../common/errors';
import { ListQueryDto } from '../dto/list-query.dto';
import { CreateTStringDto, UpdateTStringDto } from './dto/t_string.dto';

interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    search?: string;
  };
}

@Injectable()
export class TStringService {
  private readonly logger = createLogger(TStringService.name);

  constructor(
    @InjectRepository(TStringEntity)
    private readonly repository: Repository<TStringEntity>,
    private readonly cache: CacheService,
  ) {}

  async findAll(query: ListQueryDto): Promise<PaginatedResult<TStringEntity>> {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;
    const search = query.search?.trim();
    const cacheKey = `t_string:all:${limit}:${offset}:${search || 'all'}`;

    return this.cache.wrap(cacheKey, async () => {
      this.logger.debug('Fetching string resources list', { limit, offset, search });

      const qb = this.repository.createQueryBuilder('string');
      this.applySearch(qb, search);
      qb.orderBy('string.a_index', 'ASC');

      const [data, total] = await qb.take(limit).skip(offset).getManyAndCount();

      return {
        data,
        meta: {
          total,
          limit,
          offset,
          search: search || undefined,
        },
      };
    }, 120);
  }

  async findOne(id: number): Promise<TStringEntity> {
    this.logger.debug('Fetching string resource by id', { id });
    const entity = await this.repository.findOne({ where: { a_index: id } as any });

    if (!entity) {
      throw ApiError.notFound('String resource not found', 'DATA_NOT_FOUND');
    }

    return entity;
  }

  async create(data: CreateTStringDto): Promise<TStringEntity> {
    if (typeof data.a_index !== 'number') {
      throw ApiError.badRequest('String index is required', 'DATA_VALIDATION_FAILED');
    }

    const payload = sanitizeObject(data);
    if (isEmpty(payload)) {
      throw ApiError.badRequest('No string resource data provided', 'DATA_VALIDATION_FAILED');
    }

    try {
      const entity = this.repository.create(payload as Partial<TStringEntity>);
      const result = await this.repository.save(entity);
      await this.cache.invalidatePattern('t_string:*');
      this.logger.log('Created string resource', { id: result.a_index });
      return result;
    } catch (error) {
      this.logger.error('Failed to create string resource', error instanceof Error ? error.stack : undefined);
      throw ApiError.badRequest('Failed to create string resource', 'DATA_CREATE_FAILED');
    }
  }

  async update(id: number, data: UpdateTStringDto): Promise<TStringEntity> {
    const payload = sanitizeObject(data);
    if (isEmpty(payload)) {
      throw ApiError.badRequest('No string resource update data provided', 'DATA_VALIDATION_FAILED');
    }

    const result = await this.repository.update({ a_index: id } as any, payload as any);
    if (!result.affected) {
      throw ApiError.notFound('String resource not found', 'DATA_NOT_FOUND');
    }

    await this.cache.invalidatePattern('t_string:*');
    this.logger.log('Updated string resource', { id });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete({ a_index: id } as any);
    if (!result.affected) {
      throw ApiError.notFound('String resource not found', 'DATA_NOT_FOUND');
    }

    await this.cache.invalidatePattern('t_string:*');
    this.logger.log('Removed string resource', { id });
  }

  private applySearch(qb: SelectQueryBuilder<TStringEntity>, search?: string) {
    if (!search) {
      return;
    }

    const like = `%${search}%`;
    qb.where(
      'string.a_index LIKE :like OR string.a_string LIKE :like OR string.a_string_usa LIKE :like OR string.a_string_ger LIKE :like OR string.a_string_twn LIKE :like',
      { like },
    );
  }
}
