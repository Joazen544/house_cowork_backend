import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { House } from '../entities/house.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { HouseMember } from '../entities/house-member.entity';
import { Rule } from '../entities/rule.entity';

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
    const houseMembers = house.houseMembers;
    return houseMembers.map((houseMember) => houseMember.member);
  }

  async createHouseWithTransaction(manager: EntityManager, user: User, house: House, rules: string[]): Promise<House> {
    const savedHouse = await manager.save(house);

    const houseMember = new HouseMember();
    houseMember.member = user;
    houseMember.house = savedHouse;
    await manager.save(houseMember);

    if (rules && rules.length > 0) {
      const ruleEntities = rules.map((ruleContent) => {
        const rule = new Rule();
        rule.description = ruleContent;
        rule.house = savedHouse;
        return rule;
      });
      await manager.save(ruleEntities);
    }
    return savedHouse;
  }
}
