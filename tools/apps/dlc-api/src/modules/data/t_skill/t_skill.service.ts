import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TSkillEntity } from './t_skill.entity';
import { CacheService } from '../../../core/cache/cache.service';
import { createLogger, sanitizeObject, isEmpty } from '../../../common/utils';
import { ApiError } from '../../../common/errors';
import { ListQueryDto } from '../dto/list-query.dto';
import { CreateTSkillDto, UpdateTSkillDto } from './dto/t_skill.dto';

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
export class TSkillService {
  private readonly logger = createLogger(TSkillService.name);

  constructor(
    @InjectRepository(TSkillEntity)
    private readonly repository: Repository<TSkillEntity>,
    private readonly cache: CacheService,
  ) {}

  async findAll(query: ListQueryDto): Promise<PaginatedResult<TSkillEntity>> {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;
    const search = query.search?.trim();
    const cacheKey = `t_skill:all:${limit}:${offset}:${search || 'all'}`;

    return this.cache.wrap(cacheKey, async () => {
      this.logger.debug('Fetching skills list', { limit, offset, search });

      const qb = this.repository.createQueryBuilder('skill');
      this.applySearch(qb, search);
      qb.orderBy('skill.a_index', 'ASC');

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

  async count(): Promise<{ count: number }> {
    const cacheKey = 't_skill:count';
    return this.cache.wrap(cacheKey, async () => {
      this.logger.debug('Counting skills');
      const count = await this.repository.count();
      return { count };
    }, 300);
  }

  async findOne(id: number): Promise<TSkillEntity> {
    this.logger.debug('Fetching skill by id', { id });
    const entity = await this.repository.findOne({ where: { a_index: id } as any });

    if (!entity) {
      throw ApiError.notFound('Skill not found', 'DATA_NOT_FOUND');
    }

    return entity;
  }

  async create(data: CreateTSkillDto): Promise<TSkillEntity> {
    if (typeof data.a_index !== 'number') {
      throw ApiError.badRequest('Skill index is required', 'DATA_VALIDATION_FAILED');
    }

    const payload = sanitizeObject(data);
    if (isEmpty(payload)) {
      throw ApiError.badRequest('No skill data provided', 'DATA_VALIDATION_FAILED');
    }

    try {
      const entity = this.repository.create(payload as Partial<TSkillEntity>);
      const result = await this.repository.save(entity);
      await this.cache.invalidatePattern('t_skill:*');
      this.logger.log('Created skill', { id: result.a_index });
      return result;
    } catch (error) {
      this.logger.error('Failed to create skill', error instanceof Error ? error.stack : undefined);
      throw ApiError.badRequest('Failed to create skill', 'DATA_CREATE_FAILED');
    }
  }

  async update(id: number, data: UpdateTSkillDto): Promise<TSkillEntity> {
    const payload = sanitizeObject(data);
    if (isEmpty(payload)) {
      throw ApiError.badRequest('No skill update data provided', 'DATA_VALIDATION_FAILED');
    }

    const result = await this.repository.update({ a_index: id } as any, payload as any);
    if (!result.affected) {
      throw ApiError.notFound('Skill not found', 'DATA_NOT_FOUND');
    }

    await this.cache.invalidatePattern('t_skill:*');
    this.logger.log('Updated skill', { id });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete({ a_index: id } as any);
    if (!result.affected) {
      throw ApiError.notFound('Skill not found', 'DATA_NOT_FOUND');
    }

    await this.cache.invalidatePattern('t_skill:*');
    this.logger.log('Removed skill', { id });
  }

  private applySearch(qb: SelectQueryBuilder<TSkillEntity>, search?: string) {
    if (!search) {
      return;
    }

    const like = `%${search}%`;
    qb.where(
      'skill.a_name LIKE :like OR skill.a_name_twn LIKE :like OR skill.a_name_chn LIKE :like OR skill.a_client_description LIKE :like',
      { like },
    );
  }
}
