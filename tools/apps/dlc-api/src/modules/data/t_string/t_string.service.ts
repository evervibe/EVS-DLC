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

  async findAll(): Promise<TStringEntity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<TStringEntity | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async create(data: Partial<TStringEntity>): Promise<TStringEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<TStringEntity>): Promise<TStringEntity | null> {
    await this.repository.update(id, data as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
