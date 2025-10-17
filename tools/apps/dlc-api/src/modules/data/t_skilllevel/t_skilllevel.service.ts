import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TSkilllevelEntity } from './t_skilllevel.entity';
import { CacheService } from '../../../core/cache/cache.service';

@Injectable()
export class TSkilllevelService {
  constructor(
    @InjectRepository(TSkilllevelEntity)
    private readonly repository: Repository<TSkilllevelEntity>,
    private readonly cache: CacheService,
  ) {}

  async findAll(limit?: number, offset?: number): Promise<TSkilllevelEntity[]> {
    const cacheKey = `t_skilllevel:all:${limit || 'all'}:${offset || 0}`;
    return this.cache.wrap(
      cacheKey,
      () => this.repository.find({
        take: limit,
        skip: offset,
      }),
      120
    );
  }

  async findOne(id: number): Promise<TSkilllevelEntity | null> {
    return this.repository.findOne({ where: { a_index: id } as any });
  }

  async create(data: Partial<TSkilllevelEntity>): Promise<TSkilllevelEntity> {
    const entity = this.repository.create(data);
    const result = await this.repository.save(entity);
    await this.cache.invalidatePattern('t_skilllevel:*');
    return result;
  }

  async update(id: number, data: Partial<TSkilllevelEntity>): Promise<TSkilllevelEntity | null> {
    await this.repository.update({ a_index: id } as any, data as any);
    await this.cache.invalidatePattern('t_skilllevel:*');
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ a_index: id } as any);
    await this.cache.invalidatePattern('t_skilllevel:*');
  }
}
