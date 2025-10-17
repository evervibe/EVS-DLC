import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TStringEntity } from './t_string.entity';
import { CacheService } from '../../../core/cache/cache.service';

@Injectable()
export class TStringService {
  constructor(
    @InjectRepository(TStringEntity)
    private readonly repository: Repository<TStringEntity>,
    private readonly cache: CacheService,
  ) {}

  async findAll(limit?: number, offset?: number): Promise<TStringEntity[]> {
    const cacheKey = `t_string:all:${limit || 'all'}:${offset || 0}`;
    return this.cache.wrap(
      cacheKey,
      () => this.repository.find({
        take: limit,
        skip: offset,
      }),
      120
    );
  }

  async findOne(id: number): Promise<TStringEntity | null> {
    return this.repository.findOne({ where: { a_index: id } as any });
  }

  async create(data: Partial<TStringEntity>): Promise<TStringEntity> {
    const entity = this.repository.create(data);
    const result = await this.repository.save(entity);
    await this.cache.invalidatePattern('t_string:*');
    return result;
  }

  async update(id: number, data: Partial<TStringEntity>): Promise<TStringEntity | null> {
    await this.repository.update({ a_index: id } as any, data as any);
    await this.cache.invalidatePattern('t_string:*');
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ a_index: id } as any);
    await this.cache.invalidatePattern('t_string:*');
  }
}
