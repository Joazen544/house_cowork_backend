import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { House } from '../../houses/entities/house.entity';

@Injectable()
export class HousesRepository {
  constructor(@InjectRepository(House) private readonly houseRepo: Repository<House>) {}

  create(house: House) {
    return this.saveOne(house);
  }

  async saveOne(house: House) {
    return await this.houseRepo.save(house);
  }

  findOne(attrs: FindOptionsWhere<House>) {
    return this.houseRepo.findOneBy(attrs);
  }

  findMany(attrs: FindOptionsWhere<House>) {
    return this.houseRepo.findBy(attrs);
  }
}
