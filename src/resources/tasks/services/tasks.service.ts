import { ForbiddenException, Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { CreateTaskDto } from '../dtos/request/create-task.dto';
import { House } from '../../houses/entities/house.entity';
import { UpdateTaskDto } from '../dtos/request/update-task.dto';
import { UsersService } from '../../users/users.service';
import { TaskAssignment, TaskAssignmentStatus } from '../entities/task-assignment.entity';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskAssignmentsRepository } from '../repositories/task-assignments.repository';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly taskAssignmentsRepository: TaskAssignmentsRepository,
    private usersService: UsersService,
  ) {}

  async create(taskDto: CreateTaskDto, user: User) {
    const task = this.createTaskEntity(taskDto, user);
    return this.tasksRepository.create(task);
  }

  private createTaskEntity(taskDto: CreateTaskDto, user: User): Task {
    const task = new Task();
    Object.assign(task, taskDto);
    task.owner = user;
    return task;
  }

  async findOne(attrs: FindOptionsWhere<Task>) {
    return await this.tasksRepository.findOne(attrs);
  }

  async find(attrs: FindOptionsWhere<Task>) {
    return await this.tasksRepository.find(attrs);
  }

  async findByDatePeriod(startDate: Date, endDate: Date | null, house: House) {
    return await this.tasksRepository.findByDatePeriod(startDate, endDate, house);
  }

  async findUserHomePageTasks(house: House, user: User) {
    return await this.tasksRepository.findPastNotDoneTasksAndThreeDaysTasksFromToday(user, house);
  }

  isUserOwnerOfTask(user: User, task: Task) {
    return task.owner === user;
  }

  async update(task: Task, updateTaskDto: UpdateTaskDto) {
    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  async delete(task: Task) {
    await this.tasksRepository.remove(task);
    return true;
  }

  async assign(task: Task, userIds: number[]) {
    const users = await this.usersService.findByIds(userIds);
    const taskAssignments = users.map((user) => {
      const taskAssignment = new TaskAssignment();
      taskAssignment.task = task;
      taskAssignment.user = user;
      return taskAssignment;
    });
    await this.taskAssignmentsRepository.createMultiple(taskAssignments);
    return true;
  }

  async isUserAssigneeOfTask(user: User, task: Task) {
    const taskAssignment = await this.taskAssignmentsRepository.findOne({ task, user });
    return !!taskAssignment;
  }

  async respondToAssignment(task: Task, user: User, status: TaskAssignmentStatus) {
    const taskAssignment = await this.taskAssignmentsRepository.findOne({ task, user });
    if (!taskAssignment) {
      throw new ForbiddenException('Task assignment not found, user is not assignee of this task.');
    }

    const result = await this.taskAssignmentsRepository.update(taskAssignment, { assigneeStatus: status });
    if (!result.affected) {
      throw new Error('Task assignment error');
    }
    return true;
  }

  async updateTaskStatusBasedOnAssignments(task: Task) {
    if (!task) {
      throw new Error('Task not found when update after task assignment status updated');
    }

    const taskAssignments = await this.taskAssignmentsRepository.findMany({ task });

    if (taskAssignments.some((assignment: TaskAssignment) => assignment.assigneeStatus === TaskAssignmentStatus.DONE)) {
      task.status = TaskStatus.DONE;
    } else if (
      taskAssignments.every((assignment: TaskAssignment) => assignment.assigneeStatus === TaskAssignmentStatus.REJECTED)
    ) {
      task.status = TaskStatus.REJECTED;
    } else if (
      taskAssignments.some((assignment: TaskAssignment) => assignment.assigneeStatus === TaskAssignmentStatus.ACCEPTED)
    ) {
      task.status = TaskStatus.IN_PROGRESS;
    } else if (
      taskAssignments.every((assignment: TaskAssignment) => assignment.assigneeStatus === TaskAssignmentStatus.PENDING)
    ) {
      task.status = TaskStatus.OPEN;
    } else {
      throw new Error('Task status not found when update after task assignment status updated');
    }
  }
}
