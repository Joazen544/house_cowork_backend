import { Injectable } from '@nestjs/common';
import { HouseMembersRepository } from './house-members.repository';
import { User } from '../users/entities/user.entity';
import { House } from '../houses/entities/house.entity';

@Injectable()
export class HouseMembersService {
  constructor(private readonly houseMembersRepository: HouseMembersRepository) {}

  areUsersInSameHouse(user1: User, user2: User) {
    const areUsersInSameHouse = this.houseMembersRepository.ifUsersInAtLeastOneSameHouse(user1.id, user2.id);
    return areUsersInSameHouse;
  }

  addMemberToHouse(user: User, house: House) {
    return this.houseMembersRepository.addMemberToHouse(user, house);
  }
}
