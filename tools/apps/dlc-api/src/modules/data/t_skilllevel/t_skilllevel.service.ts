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

  async findAll(): Promise<TSkilllevelEntity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<TSkilllevelEntity | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async create(data: Partial<TSkilllevelEntity>): Promise<TSkilllevelEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<TSkilllevelEntity>): Promise<TSkilllevelEntity | null> {
    await this.repository.update(id, data as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
