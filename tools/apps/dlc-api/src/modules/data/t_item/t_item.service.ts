import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TItemEntity } from './t_item.entity';
import { CacheService } from '../../../core/cache/cache.service';
import { ApiError } from '../../../common/errors';
import { createLogger, sanitizeObject, isEmpty } from '../../../common/utils';
import { ListQueryDto } from '../dto/list-query.dto';
import { CreateTItemDto, UpdateTItemDto } from './dto/t_item.dto';

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
export class TItemService {
  private readonly logger = createLogger(TItemService.name);

  constructor(
    @InjectRepository(TItemEntity)
    private readonly repository: Repository<TItemEntity>,
    private readonly cache: CacheService,
  ) {}

  async findAll(query: ListQueryDto): Promise<PaginatedResult<TItemEntity>> {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;
    const search = query.search?.trim();
    const cacheKey = `t_item:all:${limit}:${offset}:${search || 'all'}`;

    return this.cache.wrap(cacheKey, async () => {
      this.logger.debug('Fetching items list', { limit, offset, search });

      const qb = this.repository.createQueryBuilder('item');
      this.applySearch(qb, search);

      qb.orderBy('item.a_index', 'ASC');
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

  async findOne(id: number): Promise<TItemEntity | null> {
    this.logger.debug('Fetching item by id', { id });
    const entity = await this.repository.findOne({ where: { a_index: id } as any });

    if (!entity) {
      throw ApiError.notFound('Item not found', 'DATA_NOT_FOUND');
    }

    return entity;
  }

  async create(data: CreateTItemDto): Promise<TItemEntity> {
    const payload = sanitizeObject(data);
    if (isEmpty(payload)) {
      throw ApiError.badRequest('No item data provided', 'DATA_VALIDATION_FAILED');
    }

    try {
      const entity = this.repository.create(payload as Partial<TItemEntity>);
      const result = await this.repository.save(entity);
      await this.cache.invalidatePattern('t_item:*');
      this.logger.log('Created item', { id: result.a_index });
      return result;
    } catch (error) {
      this.logger.error('Failed to create item', error instanceof Error ? error.stack : undefined);
      throw ApiError.badRequest('Failed to create item', 'DATA_CREATE_FAILED');
    }
  }

  async update(id: number, data: UpdateTItemDto): Promise<TItemEntity> {
    const payload = sanitizeObject(data);
    if (isEmpty(payload)) {
      throw ApiError.badRequest('No item update data provided', 'DATA_VALIDATION_FAILED');
    }

    const result = await this.repository.update({ a_index: id } as any, payload as any);
    if (!result.affected) {
      throw ApiError.notFound('Item not found', 'DATA_NOT_FOUND');
    }

    await this.cache.invalidatePattern('t_item:*');
    this.logger.log('Updated item', { id });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete({ a_index: id } as any);
    if (!result.affected) {
      throw ApiError.notFound('Item not found', 'DATA_NOT_FOUND');
    }

    await this.cache.invalidatePattern('t_item:*');
    this.logger.log('Removed item', { id });
  }

  private applySearch(qb: SelectQueryBuilder<TItemEntity>, search?: string) {
    if (!search) {
      return;
    }

    const like = `%${search}%`;
    qb.where(
      'item.a_name LIKE :like OR item.a_name_usa LIKE :like OR item.a_name_ger LIKE :like OR item.a_descr LIKE :like',
      { like },
    );
  }
}
