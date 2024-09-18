import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { TaskAssignmentStatus } from '../entities/task-assignment.entity';
import { House } from '../../houses/entities/house.entity';

@Injectable()
export class TasksRepository {
  constructor(@InjectRepository(Task) private readonly taskRepo: Repository<Task>) {}

  create(task: Task) {
    return this.save(task);
  }

  async save(task: Task) {
    return await this.taskRepo.save(task);
  }

  findOne(attrs: FindOptionsWhere<Task>): Promise<Task | null> {
    if (Object.keys(attrs).length === 0) {
      return Promise.resolve(null);
    }
    return this.taskRepo.findOne({ where: attrs });
  }

  find(attrs: FindOptionsWhere<Task>) {
    if (Object.keys(attrs).length === 0) {
      return Promise.resolve(null);
    }
    return this.taskRepo.findBy(attrs);
  }

  remove(task: Task) {
    return this.taskRepo.remove(task);
  }

  findByDatePeriod(startDate: Date, endDate: Date | null, house: House) {
    const queryBuilder = this.taskRepo.createQueryBuilder('task');

    queryBuilder.where('task.houseId = :houseId', { houseId: house.id });
    if (endDate) {
      queryBuilder.andWhere('task.dueTime BETWEEN :startDate AND :endDate', { startDate, endDate });
    } else {
      queryBuilder.andWhere('task.dueTime >= :startDate', { startDate });
    }

    return queryBuilder.getMany();
  }

  findPastNotDone(user: User, house: House) {
    const queryBuilder = this.taskRepo.createQueryBuilder('task');

    queryBuilder.leftJoinAndSelect('task.taskAssignments', 'taskAssignment');
    queryBuilder.where('task.houseId = :houseId', { houseId: house.id });
    queryBuilder.andWhere('taskAssignment.user = :user', { user });
    queryBuilder.andWhere('taskAssignment.assigneeStatus = :assigneeStatus', {
      assigneeStatus: TaskAssignmentStatus.ACCEPTED,
    });
    queryBuilder.andWhere('task.status IN (:...statuses)', { statuses: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS] });
    queryBuilder.andWhere('task.dueTime < :today', {
      today: new Date(new Date().setHours(0, 0, 0, 0)),
    });

    return queryBuilder.getMany();
  }

  findThreeDaysTasksFromToday(user: User, house: House) {
    const queryBuilder = this.taskRepo.createQueryBuilder('task');

    queryBuilder.leftJoinAndSelect('task.taskAssignments', 'taskAssignment');
    queryBuilder.where('task.houseId = :houseId', { houseId: house.id });
    queryBuilder.andWhere('taskAssignment.user = :user', { user });
    queryBuilder.andWhere('taskAssignment.assigneeStatus NOT IN (:...assigneeStatuses)', {
      assigneeStatuses: [TaskAssignmentStatus.REJECTED, TaskAssignmentStatus.CANCELLED],
    });
    queryBuilder.andWhere('task.status IN (:...statuses)', {
      statuses: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
    });

    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const startOfFourDaysLater = new Date(today);
    startOfFourDaysLater.setDate(today.getDate() + 4);
    startOfFourDaysLater.setHours(0, 0, 0, 0);

    queryBuilder.andWhere('task.dueTime >= :today AND task.dueTime < :startOfFourDaysLater', {
      today,
      startOfFourDaysLater,
    });

    queryBuilder.orderBy('task.dueTime', 'ASC');

    return queryBuilder.getMany();
  }
}
