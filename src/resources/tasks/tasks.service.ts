import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { CreateTaskDto } from './dtos/request/create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  create(taskDto: CreateTaskDto, user: User) {
    const task = this.repo.create(taskDto);
    task.owner = user;
    return this.repo.save(task);
  }
}
