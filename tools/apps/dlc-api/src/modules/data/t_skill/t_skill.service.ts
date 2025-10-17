import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TSkillEntity } from './t_skill.entity';
import { CacheService } from '../../../core/cache/cache.service';

@Injectable()
export class TSkillService {
  constructor(
    @InjectRepository(TSkillEntity)
    private readonly repository: Repository<TSkillEntity>,
    private readonly cache: CacheService,
  ) {}

  async findAll(limit?: number, offset?: number): Promise<TSkillEntity[]> {
    const cacheKey = `t_skill:all:${limit || 'all'}:${offset || 0}`;
    return this.cache.wrap(
      cacheKey,
      () => this.repository.find({
        take: limit,
        skip: offset,
      }),
      120
    );
  }

  async findOne(id: number): Promise<TSkillEntity | null> {
    return this.repository.findOne({ where: { a_index: id } as any });
  }

  async create(data: Partial<TSkillEntity>): Promise<TSkillEntity> {
    const entity = this.repository.create(data);
    const result = await this.repository.save(entity);
    await this.cache.invalidatePattern('t_skill:*');
    return result;
  }

  async update(id: number, data: Partial<TSkillEntity>): Promise<TSkillEntity | null> {
    await this.repository.update({ a_index: id } as any, data as any);
    await this.cache.invalidatePattern('t_skill:*');
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ a_index: id } as any);
    await this.cache.invalidatePattern('t_skill:*');
  }
}
