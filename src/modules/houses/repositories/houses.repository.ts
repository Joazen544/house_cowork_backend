import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { House } from '../entities/house.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { HouseUser } from '../entities/house-user.entity';

@Injectable()
export class HousesRepository extends BaseRepository<House> {
  constructor(
    @InjectRepository(House) private readonly houseRepo: Repository<House>,
    @InjectRepository(HouseUser) private readonly houseUserRepo: Repository<HouseUser>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(House, dataSource);
  }

  async findHousesByUser(user: User) {
    const houseUsers = await this.houseUserRepo.find({
      where: { user: user },
      relations: ['house'],
    });
    const houses = houseUsers.map((houseUser) => houseUser.house);

    return houses;
  }
}
