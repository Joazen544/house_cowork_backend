import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { House } from '../entities/house.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { HouseMember } from '../entities/house-member.entity';

@Injectable()
export class HousesRepository extends BaseRepository<House> {
  constructor(
    @InjectRepository(House) private readonly houseRepo: Repository<House>,
    @InjectRepository(HouseMember) private readonly HouseMemberRepo: Repository<HouseMember>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(House, dataSource);
  }

  async findHousesByUser(user: User) {
    const HouseMembers = await this.HouseMemberRepo.find({
      where: { member: user },
      relations: ['house'],
    });
    const houses = HouseMembers.map((HouseMember) => HouseMember.house);

    return houses;
  }

  async getHouseMembers(house: House) {
    const houseMembers = await this.HouseMemberRepo.find({
      where: { house: { id: house.id } },
      relations: ['member'],
    });
    console.log(houseMembers);
    return houseMembers.map((houseMember) => houseMember.member);
  }
}
