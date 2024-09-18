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

  save(task: Task) {
    return this.taskRepo.save(task);
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

  update(id: number, updateData: Partial<Task>): Promise<UpdateResult> {
    return this.taskRepo.update(id, updateData);
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

  findPastNotDoneTasksAndThreeDaysTasksFromToday(user: User, house: House) {
    const queryBuilder = this.taskRepo.createQueryBuilder('task');

    queryBuilder.leftJoinAndSelect('task.taskAssignments', 'taskAssignment');
    queryBuilder.where('task.houseId = :houseId', { houseId: house.id });
    queryBuilder.andWhere('taskAssignment.user = :user', { user });

    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const startOfFourDaysLater = new Date(today);
    startOfFourDaysLater.setDate(today.getDate() + 4);
    startOfFourDaysLater.setHours(0, 0, 0, 0);

    queryBuilder.andWhere(
      '(' +
        '(task.dueTime < :today AND task.status IN (:...pastNotDoneStatuses) AND taskAssignment.assigneeStatus = :acceptedStatus)' +
        ' OR ' +
        '(task.dueTime >= :today AND task.dueTime < :startOfFourDaysLater AND task.status IN (:...threeDaysStatuses) AND taskAssignment.assigneeStatus NOT IN (:...rejectedStatuses))' +
        ')',
      {
        today,
        startOfFourDaysLater,
        pastNotDoneStatuses: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS],
        acceptedStatus: TaskAssignmentStatus.ACCEPTED,
        threeDaysStatuses: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
        rejectedStatuses: [TaskAssignmentStatus.REJECTED, TaskAssignmentStatus.CANCELLED],
      },
    );

    queryBuilder.orderBy('task.dueTime', 'ASC');

    return queryBuilder.getMany();
  }
}
