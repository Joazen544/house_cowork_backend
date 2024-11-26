import { Between, DataSource, In, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { User } from '../../users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { TaskAssignmentStatus } from '../entities/task-assignment.entity';
import { House } from '../../houses/entities/house.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class TasksRepository extends BaseRepository<Task> {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(Task, dataSource);
  }

  findByDatePeriod(startDate: Date, endDate: Date | null, house: House) {
    const whereConditions: any = {
      house: { id: house.id },
      dueTime: endDate ? Between(startDate, endDate) : MoreThanOrEqual(startDate),
    };

    return this.taskRepo.find({
      where: whereConditions,
    });
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

  async findAssignedTasks(
    house: House,
    user: User,
    taskStatuses: TaskStatus[],
    taskAssignmentStatuses: TaskAssignmentStatus[],
  ) {
    const tasksAssignedToUser = await this.taskRepo.find({
      where: {
        house: { id: house.id },
        taskAssignments: {
          user: { id: user.id },
          assigneeStatus: In(taskAssignmentStatuses),
        },
        status: In(taskStatuses),
      },
    });

    return tasksAssignedToUser;
  }
}
