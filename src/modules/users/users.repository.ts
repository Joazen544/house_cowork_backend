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
}
