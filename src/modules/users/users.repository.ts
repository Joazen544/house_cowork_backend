import { DataSource, FindOneOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(User, dataSource);
  }

  save(user: User) {
    return this.userRepo.save(user);
  }

  findByIds(ids: number[]) {
    return this.userRepo.findBy({ id: In(ids) });
  }

  async areUsersInSameHouse(user1Id: number, user2Id: number): Promise<boolean> {
    const user1 = await this.findOne({ where: { id: user1Id }, relations: ['houseMembers', 'houseMembers.house'] });
    const user2 = await this.findOne({ where: { id: user2Id }, relations: ['houseMembers', 'houseMembers.house'] });

    if (!user1 || !user2) {
      return false;
    }

    const user1HouseIds = new Set(user1.houseMembers.map(({ house }) => house.id));
    return user2.houseMembers.some(({ house }) => user1HouseIds.has(house.id));
  }
}
