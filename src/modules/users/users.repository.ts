import { FindOptionsWhere, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  create(email: string, password: string, name: string, nickName: string) {
    const user = this.userRepo.create({ email, password, name, nickName });
    return this.userRepo.save(user);
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

  find(attrs: FindOptionsWhere<User>) {
    if (Object.keys(attrs).length === 0) {
      return Promise.resolve(null);
    }
    return this.userRepo.findBy(attrs);
  }

  findByIds(ids: number[]) {
    return this.userRepo.findBy({ id: In(ids) });
  }
}
