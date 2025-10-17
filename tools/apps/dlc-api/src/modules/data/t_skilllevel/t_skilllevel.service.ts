import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TSkilllevelEntity } from './t_skilllevel.entity';

@Injectable()
export class TSkilllevelService {
  constructor(
    @InjectRepository(TSkilllevelEntity)
    private readonly repository: Repository<TSkilllevelEntity>,
  ) {}

  async findAll(limit?: number, offset?: number): Promise<TSkilllevelEntity[]> {
    return this.repository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number): Promise<TSkilllevelEntity | null> {
    return this.repository.findOne({ where: { a_index: id } as any });
  }

  async create(data: Partial<TSkilllevelEntity>): Promise<TSkilllevelEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<TSkilllevelEntity>): Promise<TSkilllevelEntity | null> {
    await this.repository.update({ a_index: id } as any, data as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ a_index: id } as any);
  }
}
