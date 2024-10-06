import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { UsersNotFoundException } from 'src/common/exceptions/users/users-not-found.exception';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(email: string, password: string, name: string, nickName: string) {
    const user = this.usersRepository.create({ email, password, name, nickName });

    return user;
  }

  async findOneBy(attrs: FindOptionsWhere<User>) {
    return this.usersRepository.findOneBy(attrs);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findBy({ email });
  }

  async findByIds(ids: number[]): Promise<User[]> {
    const users = await this.usersRepository.findByIds(ids);
    if (users.length !== ids.length) {
      throw new UsersNotFoundException();
    }
    return users;
  }

  async update(user: User, attrs: Partial<User>) {
    Object.assign(user, attrs);
    const updatedUser = await this.usersRepository.save(user);
    return updatedUser;
  }

  areUsersInSameHouse(user1: User, user2: User) {
    const areUsersInSameHouse = this.usersRepository.areUsersInSameHouse(user1.id, user2.id);
    return areUsersInSameHouse;
  }
}
