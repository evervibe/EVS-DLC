import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TCharacterEntity } from './t_character.entity';

@Injectable()
export class TCharacterService {
  constructor(
    @InjectRepository(TCharacterEntity)
    private readonly repository: Repository<TCharacterEntity>,
  ) {}

  async findAll(): Promise<TCharacterEntity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<TCharacterEntity | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async create(data: Partial<TCharacterEntity>): Promise<TCharacterEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<TCharacterEntity>): Promise<TCharacterEntity | null> {
    await this.repository.update(id, data as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
