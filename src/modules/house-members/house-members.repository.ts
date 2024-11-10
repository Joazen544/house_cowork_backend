import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { HouseMember } from './house-member.entity';

@Injectable()
export class HouseMembersRepository extends BaseRepository<HouseMember> {
  constructor(
    @InjectRepository(HouseMember) private readonly houseMemberRepo: Repository<HouseMember>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(HouseMember, dataSource);
  }

  async ifUsersInAtLeastOneSameHouse(userOneId: number, userTwoId: number): Promise<boolean> {
    const houseMembers = await this.houseMemberRepo.findBy({ member: { id: userOneId || userTwoId } });
    const userOneHouseIds = new Set();
    const userTwoHouseIds = new Set();
    houseMembers.forEach((houseMember) => {
      if (houseMember.memberId === userOneId) userOneHouseIds.add(houseMember.houseId);
      if (houseMember.memberId === userTwoId) userTwoHouseIds.add(houseMember.houseId);
    });

    for (const houseId of userOneHouseIds) {
      if (userTwoHouseIds.has(houseId)) {
        return true;
      }
    }

    return false;
  }
}
