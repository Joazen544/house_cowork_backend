import { NotFoundException, Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(email: string, password: string, name: string, nickName: string) {
    const user = this.usersRepository.create(email, password, name, nickName);

    return user;
  }

  async findOne(attrs: FindOptionsWhere<User>) {
    return this.usersRepository.findOne(attrs);
  }

  async find(email: string) {
    return this.usersRepository.find({ email });
  }

  async findByIds(ids: number[]): Promise<User[]> {
    const users = await this.usersRepository.findByIds(ids);
    if (users.length !== ids.length) {
      throw new NotFoundException('One or more users not found');
    }
    return users;
  }

  async update(user: User, attrs: Partial<User>) {
    Object.assign(user, attrs);
    return await this.usersRepository.save(user);
  }

  areUsersInSameHouse(user1: User, user2: User) {
    return user1.houses.some((house) => user2.houses.includes(house));
  }
}
