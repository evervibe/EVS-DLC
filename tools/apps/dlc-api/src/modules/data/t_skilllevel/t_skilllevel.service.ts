import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TSkilllevelEntity } from './t_skilllevel.entity';
import { TSkillEntity } from '../t_skill/t_skill.entity';
import { CacheService } from '../../../core/cache/cache.service';
import { createLogger, sanitizeObject, isEmpty } from '../../../common/utils';
import { ApiError } from '../../../common/errors';
import { SkillLevelQueryDto } from './dto/t_skilllevel-query.dto';
import { CreateTSkilllevelDto, UpdateTSkilllevelDto } from './dto/t_skilllevel.dto';

interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    search?: string;
    skillId?: number;
  };
}

@Injectable()
export class TSkilllevelService {
  private readonly logger = createLogger(TSkilllevelService.name);

  constructor(
    @InjectRepository(TSkilllevelEntity)
    private readonly repository: Repository<TSkilllevelEntity>,
    private readonly cache: CacheService,
  ) {}

  async findAll(query: SkillLevelQueryDto): Promise<PaginatedResult<TSkilllevelEntity>> {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;
    const search = query.search?.trim();
    const cacheKey = `t_skilllevel:all:${limit}:${offset}:${search || 'all'}:${query.skillId || 'any'}`;

    return this.cache.wrap(cacheKey, async () => {
      this.logger.debug('Fetching skill levels list', {
        limit,
        offset,
        search,
        skillId: query.skillId,
      });

      const qb = this.repository
        .createQueryBuilder('level')
        .leftJoinAndSelect('level.skill', 'skill');

      this.applySearch(qb, search);

      if (query.skillId !== undefined) {
        qb.andWhere('skill.a_index = :skillId', { skillId: query.skillId });
      }

      qb.orderBy('level.a_index', 'ASC');

      const [data, total] = await qb.take(limit).skip(offset).getManyAndCount();

      return {
        data,
        meta: {
          total,
          limit,
          offset,
          search: search || undefined,
          skillId: query.skillId,
        },
      };
    }, 120);
  }

  async count(): Promise<{ count: number }> {
    const cacheKey = 't_skilllevel:count';
    return this.cache.wrap(cacheKey, async () => {
      this.logger.debug('Counting skill levels');
      const count = await this.repository.count();
      return { count };
    }, 300);
  }

  async findOne(id: number): Promise<TSkilllevelEntity> {
    this.logger.debug('Fetching skill level by id', { id });
    const entity = await this.repository.findOne({
      where: { a_index: id } as any,
      relations: ['skill'],
    });

    if (!entity) {
      throw ApiError.notFound('Skill level not found', 'DATA_NOT_FOUND');
    }

    return entity;
  }

  async create(data: CreateTSkilllevelDto): Promise<TSkilllevelEntity> {
    if (typeof data.a_index !== 'number') {
      throw ApiError.badRequest('Skill level index is required', 'DATA_VALIDATION_FAILED');
    }

    const payload = sanitizeObject(data);
    if (isEmpty(payload)) {
      throw ApiError.badRequest('No skill level data provided', 'DATA_VALIDATION_FAILED');
    }

    await this.ensureSkillExists(data.a_index);

    const existing = await this.repository.findOne({ where: { a_index: data.a_index } as any });
    if (existing) {
      throw ApiError.conflict('Skill level already exists', 'DATA_ALREADY_EXISTS');
    }

    try {
      const entity = this.repository.create(payload as Partial<TSkilllevelEntity>);
      const result = await this.repository.save(entity);
      await this.cache.invalidatePattern('t_skilllevel:*');
      this.logger.log('Created skill level', { id: result.a_index });
      return result;
    } catch (error) {
      this.logger.error('Failed to create skill level', error instanceof Error ? error.stack : undefined);
      throw ApiError.badRequest('Failed to create skill level', 'DATA_CREATE_FAILED');
    }
  }

  async update(id: number, data: UpdateTSkilllevelDto): Promise<TSkilllevelEntity> {
    const payload = sanitizeObject(data);
    if (isEmpty(payload)) {
      throw ApiError.badRequest('No skill level update data provided', 'DATA_VALIDATION_FAILED');
    }

    if ('a_index' in payload) {
      delete (payload as any).a_index;
    }

    const result = await this.repository.update({ a_index: id } as any, payload as any);
    if (!result.affected) {
      throw ApiError.notFound('Skill level not found', 'DATA_NOT_FOUND');
    }

    await this.cache.invalidatePattern('t_skilllevel:*');
    this.logger.log('Updated skill level', { id });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete({ a_index: id } as any);
    if (!result.affected) {
      throw ApiError.notFound('Skill level not found', 'DATA_NOT_FOUND');
    }

    await this.cache.invalidatePattern('t_skilllevel:*');
    this.logger.log('Removed skill level', { id });
  }

  private applySearch(qb: SelectQueryBuilder<TSkilllevelEntity>, search?: string) {
    if (!search) {
      return;
    }

    const like = `%${search}%`;
    qb.where(
      'level.a_index LIKE :like OR skill.a_name LIKE :like OR skill.a_index LIKE :like',
      { like },
    );
  }

  private async ensureSkillExists(skillIndex: number): Promise<void> {
    const skill = await this.repository.manager.findOne(TSkillEntity, {
      where: { a_index: skillIndex } as any,
    });

    if (!skill) {
      throw ApiError.badRequest('Referenced skill does not exist', 'DATA_VALIDATION_FAILED');
    }
  }
}
