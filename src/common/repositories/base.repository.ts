import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, EntityTarget, ObjectLiteral, DeepPartial, FindOptionsWhere, DataSource } from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> {
  private repository: Repository<T>;

  constructor(entity: EntityTarget<T>, @InjectDataSource() dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data as DeepPartial<T>);
    return await this.repository.save(entity);
  }

  async findOne(data: FindOptionsWhere<T>): Promise<T | null> {
    if (Object.keys(data).length === 0) {
      return Promise.resolve(null);
    }
    return await this.repository.findOne({ where: data });
  }

  async find(data: FindOptionsWhere<T>): Promise<T[]> {
    if (Object.keys(data).length === 0) {
      return Promise.resolve([]);
    }
    return await this.repository.findBy(data);
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

  save(entity: T) {
    return this.repository.save(entity);
  }
}
