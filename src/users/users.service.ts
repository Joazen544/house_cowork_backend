import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users = [
    { id: 0, name: 'Johnson', age: 25 },
    { id: 1, name: 'Polly', age: 24 },
  ];

  getUsers(age?: number) {
    if (age) {
      return this.users.filter((user) => user.age == age);
    }

    return this.users;
  }

  getUser(id: number) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  createUser(createUserDto: CreateUserDto) {
    const lastUser = this.users[this.users.length - 1];
    const lastId = lastUser.id;
    const newUser = {
      ...createUserDto,
      id: lastId + 1,
    };
    this.users.push(newUser);
    return this.users;
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...updateUserDto };
      }
      return user;
    });

    return this.getUser(id);
  }

  removeUser(id: number) {
    const removedTarget = this.getUser(id);

    this.users = this.users.filter((user) => user.id !== id);

    return removedTarget;
  }
}
