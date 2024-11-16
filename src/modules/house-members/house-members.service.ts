import { Injectable } from '@nestjs/common';
import { HouseMembersRepository } from './house-members.repository';
import { User } from '../users/entities/user.entity';
import { House } from '../houses/entities/house.entity';

@Injectable()
export class HouseMembersService {
  constructor(private readonly houseMembersRepository: HouseMembersRepository) {}

  areUsersInSameHouse(userOneId: number, userTwoId: number) {
    const areUsersInSameHouse = this.houseMembersRepository.ifUsersInAtLeastOneSameHouse(userOneId, userTwoId);
    return areUsersInSameHouse;
  }

  async isUserMemberOfHouse(userId: number, houseId: number) {
    const isUserMemberOfHouse = await this.houseMembersRepository.findOneBy({
      memberId: userId,
      houseId: houseId,
    });
    return isUserMemberOfHouse;
  }

  addMemberToHouse(user: User, house: House) {
    return this.houseMembersRepository.addMemberToHouse(user, house);
  }

  async getHouseMembers(houseId: number) {
    const houseMembers = await this.houseMembersRepository.findByHouseId(houseId);

    return houseMembers;
  }

  async findOneByHouseIdAndUserId(houseId: number, userId: number) {
    return this.houseMembersRepository.findOneBy({ houseId: houseId, memberId: userId });
  }

  async findHousesByMemberId(memberId: number) {
    return this.houseMembersRepository.findBy({ memberId: memberId });
  }
}
