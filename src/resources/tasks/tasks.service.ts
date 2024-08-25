import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { CreateTaskDto } from './dtos/request/create-task.dto';
import { House } from '../houses/entities/house.entity';
import { UpdateTaskDto } from './dtos/request/update-task.dto';
import { UsersService } from '../users/users.service';
import { TaskAssignment } from './entities/task-assignment.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private repo: Repository<Task>,
    @InjectRepository(TaskAssignment) private taskAssigneeRepo: Repository<TaskAssignment>,
    private usersService: UsersService,
  ) {}

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

  findByDatePeriod(startDate: Date, endDate: Date | null, house: House) {
    const queryBuilder = this.repo.createQueryBuilder('task');

    queryBuilder.where('task.houseId = :houseId', { houseId: house.id });
    if (endDate) {
      queryBuilder.andWhere('task.dueTime BETWEEN :startDate AND :endDate', { startDate, endDate });
    } else {
      queryBuilder.andWhere('task.dueTime >= :startDate', { startDate });
    }

    return queryBuilder.getMany();
  }

  isUserOwnerOfTask(user: User, task: Task) {
    return task.owner === user;
  }

  update(task: Task, updateTaskDto: UpdateTaskDto) {
    Object.assign(task, updateTaskDto);
    return this.repo.save(task);
  }

  async delete(task: Task) {
    await this.repo.remove(task);
    return true;
  }

  async assign(task: Task, userIds: number[]) {
    const users = await this.usersService.findByIds(userIds);
    const taskAssignments = users.map((user) => ({
      task,
      user,
    }));
    await this.taskAssigneeRepo.save(taskAssignments);
    return true;
  }
}
