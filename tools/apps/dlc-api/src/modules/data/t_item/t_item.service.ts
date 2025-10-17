import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TItemEntity } from './t_item.entity';

@Injectable()
export class TItemService {
  constructor(
    @InjectRepository(TItemEntity)
    private readonly repository: Repository<TItemEntity>,
  ) {}

  async findAll(): Promise<TItemEntity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<TItemEntity | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async create(data: Partial<TItemEntity>): Promise<TItemEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<TItemEntity>): Promise<TItemEntity | null> {
    await this.repository.update(id, data as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
