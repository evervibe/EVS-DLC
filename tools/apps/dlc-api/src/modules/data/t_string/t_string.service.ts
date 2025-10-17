import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TStringEntity } from './t_string.entity';

@Injectable()
export class TStringService {
  constructor(
    @InjectRepository(TStringEntity)
    private readonly repository: Repository<TStringEntity>,
  ) {}

  async findAll(limit?: number, offset?: number): Promise<TStringEntity[]> {
    return this.repository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number): Promise<TStringEntity | null> {
    return this.repository.findOne({ where: { a_index: id } as any });
  }

  async create(data: Partial<TStringEntity>): Promise<TStringEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<TStringEntity>): Promise<TStringEntity | null> {
    await this.repository.update({ a_index: id } as any, data as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ a_index: id } as any);
  }
}
