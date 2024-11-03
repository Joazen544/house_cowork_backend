import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { User } from '../../users/entities/user.entity';
import { CreateTaskDto } from '../dtos/request/create-task.dto';
import { House } from '../../houses/entities/house.entity';
import { UpdateTaskDto } from '../dtos/request/update-task.dto';
import { UsersService } from '../../users/users.service';
import { TaskAssignment, TaskAssignmentStatus } from '../entities/task-assignment.entity';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskAssignmentsRepository } from '../repositories/task-assignments.repository';
import { TaskAssignmentNotFoundException } from '../../../common/exceptions/tasks/task-assignment-not-found.exception';
import { HousesService } from '../../houses/houses.service';
import { UserNotMemberOfHouseException } from '../../../common/exceptions/houses/user-not-member-of-house-exception';
import { TaskIsNotAcceptableException } from '../../../common/exceptions/tasks/task-is-not-acceptable.exception';
import { UserIsNotAcceptorException } from '../../../common/exceptions/tasks/user-is-not-acceptor.exception';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly taskAssignmentsRepository: TaskAssignmentsRepository,
    private readonly housesService: HousesService,
    private usersService: UsersService,
  ) {}

  async create(taskDto: CreateTaskDto, user: User, house: House) {
    const task = this.createTaskEntity(taskDto, user, house);
    const isAllAssigneesMemberOfHouse = await this.checkIfAllAssigneesMemberOfHouse(taskDto.assigneeIds, house);

    if (!isAllAssigneesMemberOfHouse) {
      throw new UserNotMemberOfHouseException();
    }

    const assignedUsers = await this.usersService.findByIds(taskDto.assigneeIds);

    task.taskAssignments = assignedUsers.map((assigneeUser) => {
      const taskAssignment = new TaskAssignment();
      taskAssignment.user = assigneeUser;
      return taskAssignment;
    });

    const createdTask = await this.tasksRepository.create(task);
    const wholeTask = await this.tasksRepository.findOneBy({ id: createdTask.id });

    if (!wholeTask) {
      throw new Error('Task creation failed');
    }
    return wholeTask;
  }

  private createTaskEntity(taskDto: CreateTaskDto, user: User, house: House): Task {
    const task = new Task();
    Object.assign(task, taskDto);
    task.owner = user;
    task.house = house;
    return task;
  }

  private async checkIfAllAssigneesMemberOfHouse(assigneeIds: number[], house: House) {
    const houseMembers = await this.housesService.getHouseMembers(house);
    return assigneeIds.every((assigneeId) => houseMembers.some((member) => member.id === assigneeId));
  }

  async findOne(attrs: FindOptionsWhere<Task>) {
    return this.tasksRepository.findOneBy(attrs);
  }

  async find(attrs: FindOptionsWhere<Task>) {
    return this.tasksRepository.findBy(attrs);
  }

  async findByDatePeriod(startDate: Date, endDate: Date | null, house: House) {
    return this.tasksRepository.findByDatePeriod(startDate, endDate, house);
  }

  async findUserHomePageTasks(house: House, user: User) {
    return this.tasksRepository.findPastNotDoneTasksAndThreeDaysTasksFromToday(user, house);
  }

  async findAssignedTasks(house: House, user: User) {
    const tasks = await this.tasksRepository.findAssignedTasks(
      house,
      user,
      [TaskStatus.OPEN, TaskStatus.IN_PROGRESS],
      [TaskAssignmentStatus.PENDING],
    );
    return tasks.map((task) => this.toTaskInResponseDto(task));
  }

  isUserOwnerOfTask(user: User, task: Task) {
    return task.owner === user;
  }

  toTaskInResponseDto(task: Task) {
    return {
      ...task,
      ownerId: task.owner.id,
      assignees: task.taskAssignments.map((assignment) => ({
        assigneeId: assignment.user.id,
        assigneeStatus: assignment.assigneeStatus,
      })),
    };
  }

  async update(task: Task, updateTaskDto: UpdateTaskDto) {
    return this.tasksRepository.update(task.id, updateTaskDto);
  }

  async delete(task: Task) {
    await this.tasksRepository.delete(task.id);
    return true;
  }

  async assign(task: Task, userIds: number[]) {
    const users = await this.usersService.findByIds(userIds);

    if (users.length !== userIds.length) {
      throw new Error('Some users were not found');
    }

    const taskAssignments = users.map((user) => {
      const taskAssignment = new TaskAssignment();
      taskAssignment.task = task;
      taskAssignment.user = user;
      return taskAssignment;
    });

    return this.taskAssignmentsRepository.createMultiple(taskAssignments);
  }
}
