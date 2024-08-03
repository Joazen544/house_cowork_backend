import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
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

  findOne(attrs: FindOptionsWhere<User>) {
    if (Object.values(attrs).length === 0) {
      return null;
    }
    return this.repo.findOneBy(attrs);
  }

  find(attrs: FindOptionsWhere<Task>) {
    return this.repo.find({ where: attrs });
  }

  findByDatePeriod(startTime: Date, endTime: Date) {
    return this.repo
      .createQueryBuilder('task')
      .where('task.dueTime BETWEEN :startDate AND :endDate', { startTime, endTime }) // 构建查询条件
      .getMany();
  }
}
