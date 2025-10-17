import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TItemEntity } from './t_item.entity';
import { CacheService } from '../../../core/cache/cache.service';

@Injectable()
export class TItemService {
  constructor(
    @InjectRepository(TItemEntity)
    private readonly repository: Repository<TItemEntity>,
    private readonly cache: CacheService,
  ) {}

  async findAll(limit?: number, offset?: number): Promise<TItemEntity[]> {
    const cacheKey = `t_item:all:${limit || 'all'}:${offset || 0}`;
    return this.cache.wrap(
      cacheKey,
      () => this.repository.find({
        take: limit,
        skip: offset,
      }),
      120
    );
  }

  async findOne(id: number): Promise<TItemEntity | null> {
    return this.repository.findOne({ where: { a_index: id } as any });
  }

  async create(data: Partial<TItemEntity>): Promise<TItemEntity> {
    const entity = this.repository.create(data);
    const result = await this.repository.save(entity);
    await this.cache.invalidatePattern('t_item:*');
    return result;
  }

  async update(id: number, data: Partial<TItemEntity>): Promise<TItemEntity | null> {
    await this.repository.update({ a_index: id } as any, data as any);
    await this.cache.invalidatePattern('t_item:*');
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ a_index: id } as any);
    await this.cache.invalidatePattern('t_item:*');
  }
}
