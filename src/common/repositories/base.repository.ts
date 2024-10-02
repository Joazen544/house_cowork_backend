import { Repository, EntityTarget, ObjectLiteral, DeepPartial } from 'typeorm';
import AppDataSource from '../../db/data-source';

export class BaseRepository<T extends ObjectLiteral> {
  private repository: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity);
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data as DeepPartial<T>);
    return await this.repository.save(entity);
  }

  async findOne(data: Partial<T>): Promise<T | null> {
    return await this.repository.findOne({ where: { ...data } });
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    await this.repository.update(id, data);
    return this.findOne({ id } as unknown as Partial<T>);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
