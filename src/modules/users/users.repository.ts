import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm';
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
    super(dataSource, User);
  }

  save(user: User) {
    return this.userRepo.save(user);
  }

  findOne(attrs: FindOptionsWhere<User>): Promise<User | null> {
    if (Object.keys(attrs).length === 0) {
      return Promise.resolve(null);
    }
    return this.userRepo.findOne({ where: attrs });
  }

  findByIds(ids: number[]) {
    return this.userRepo.findBy({ id: In(ids) });
  }
}
