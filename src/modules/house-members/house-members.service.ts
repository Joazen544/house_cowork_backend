import { Injectable } from '@nestjs/common';
import { HouseMembersRepository } from './house-members.repository';
import { User } from '../users/entities/user.entity';

@Injectable()
export class HouseMembersService {
  constructor(private readonly houseMembersRepository: HouseMembersRepository) {}

  areUsersInSameHouse(user1: User, user2: User) {
    const areUsersInSameHouse = this.houseMembersRepository.ifUsersInAtLeastOneSameHouse(user1.id, user2.id);
    return areUsersInSameHouse;
  }
}
