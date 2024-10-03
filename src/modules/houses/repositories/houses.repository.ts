import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { House } from '../entities/house.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class HousesRepository extends BaseRepository<House> {
  constructor(
    @InjectRepository(House) private readonly houseRepo: Repository<House>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(House, dataSource);
  }

  findOne(attrs: FindOptionsWhere<House>) {
    return this.houseRepo.findOneBy(attrs);
  }

  findMany(attrs: FindOptionsWhere<House>) {
    return this.houseRepo.findBy(attrs);
  }
}
