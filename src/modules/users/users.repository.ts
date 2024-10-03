import { DataSource, In, Repository } from 'typeorm';
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
    const result = await this.userRepo
      .createQueryBuilder('user1')
      .innerJoin('user1.houseMembers', 'hm1')
      .innerJoin('hm1.house', 'house')
      .innerJoin('house.houseMembers', 'hm2')
      .innerJoin('hm2.user', 'user2')
      .where('user1.id = :user1Id', { user1Id })
      .andWhere('user2.id = :user2Id', { user2Id })
      .getCount();

    return result > 0;
  }
}
