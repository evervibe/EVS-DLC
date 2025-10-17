import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TSkillEntity } from './t_skill.entity';

@Injectable()
export class TSkillService {
  constructor(
    @InjectRepository(TSkillEntity)
    private readonly repository: Repository<TSkillEntity>,
  ) {}

  async findAll(): Promise<TSkillEntity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<TSkillEntity | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async create(data: Partial<TSkillEntity>): Promise<TSkillEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<TSkillEntity>): Promise<TSkillEntity | null> {
    await this.repository.update(id, data as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
