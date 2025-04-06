import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { House } from '../entities/house.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { HouseMember } from 'src/modules/houses/modules/house-members/house-member.entity';

@Injectable()
export class HousesRepository extends BaseRepository<House> {
  constructor(
    @InjectRepository(HouseMember) private readonly HouseMemberRepo: Repository<HouseMember>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(House, dataSource);
  }

  async findHousesByUser(user: User) {
    const HouseMembers = await this.HouseMemberRepo.find({
      where: { memberId: user.id },
      relations: ['house'],
    });
    const houses = await Promise.all(HouseMembers.map(async (HouseMember) => await HouseMember.house));

    return houses;
  }

  async getHouseMembers(house: House) {
    const houseMembers = house.houseMembers;
    if (!houseMembers) {
      return [];
    }
    return houseMembers.map((houseMember) => houseMember.member);
  }
}
