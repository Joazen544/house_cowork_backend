import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from '../entities/task.entity';
import { TaskAssignmentStatus } from '../entities/task-assignment.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskAssignment } from '../entities/task-assignment.entity';
import { TaskAssignmentNotFoundException } from '../../../common/exceptions/tasks/task-assignment-not-found.exception';
import { TaskAssignmentsRepository } from '../repositories/task-assignments.repository';
import { Transactional } from 'typeorm-transactional';
import { TaskIsNotAcceptableException } from 'src/common/exceptions/tasks/task-is-not-acceptable.exception';
import { TaskIsNotRejectableException } from 'src/common/exceptions/tasks/task-is-not-rejectable.exception';

export interface TaskStatusResponse {
  taskStatus: TaskStatus;
  taskAssignments: TaskAssignment[];
}

type TaskAssignmentStatusAvailable =
  | TaskAssignmentStatus.ACCEPTED
  | TaskAssignmentStatus.REJECTED
  | TaskAssignmentStatus.PENDING
  | TaskAssignmentStatus.DONE;

@Injectable()
export class RespondToTaskService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly taskAssignmentsRepository: TaskAssignmentsRepository,
  ) {}

  async accept(task: Task, user: User): Promise<TaskStatusResponse> {
    const taskStatusResponse = await this.respondToTask(task, user, TaskAssignmentStatus.ACCEPTED);
    // TODO: Send notification to owner and other assignees

    return taskStatusResponse;
  }

  async reject(task: Task, user: User): Promise<TaskStatusResponse> {
    const taskStatusResponse = await this.respondToTask(task, user, TaskAssignmentStatus.REJECTED);
    // TODO: Send notification to owner and other assignees

    return taskStatusResponse;
  }

  async pending(task: Task, user: User) {
    const taskStatusResponse = await this.respondToTask(task, user, TaskAssignmentStatus.PENDING);
    // TODO: Send notification to owner and other assignees

    return taskStatusResponse;
  }

  async complete(task: Task, user: User) {
    const taskStatusResponse = await this.respondToTask(task, user, TaskAssignmentStatus.DONE);
    // TODO: Send notification to owner and other assignees

    return taskStatusResponse;
  }

  private async respondToTask(task: Task, user: User, taskAssignmentStatus: TaskAssignmentStatusAvailable) {
    this.checkIfTaskAbleToBeResponded(task, taskAssignmentStatus);
    const taskAssignment = await this.getTaskAssignment(task, user);

    const taskStatusResponse = await this.updateAssignmentStatusAndTaskStatus(
      task,
      taskAssignment,
      taskAssignmentStatus,
    );

    // TODO: Send notification to owner and other assignees

    return taskStatusResponse;
  }

  private checkIfTaskAbleToBeResponded(task: Task, taskAssignmentStatus: TaskAssignmentStatusAvailable) {
    if (taskAssignmentStatus === TaskAssignmentStatus.ACCEPTED) {
      if ([TaskStatus.OPEN, TaskStatus.REJECTED].includes(task.status)) {
        return true;
      }
      throw new TaskIsNotAcceptableException([TaskStatus.OPEN, TaskStatus.REJECTED]);
    }

    if (taskAssignmentStatus === TaskAssignmentStatus.REJECTED) {
      if ([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE].includes(task.status)) {
        return true;
      }
      throw new TaskIsNotRejectableException();
    }

    if (taskAssignmentStatus === TaskAssignmentStatus.PENDING) {
      if ([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.REJECTED].includes(task.status)) {
        return true;
      }
      return false;
    }

    if (taskAssignmentStatus === TaskAssignmentStatus.DONE) {
      if ([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.REJECTED].includes(task.status)) {
        return true;
      }
      return false;
    }

    return false;
  }

  @Transactional()
  private async updateTaskStatusBasedOnAssignments(task: Task) {
    if (!task) {
      throw new Error('Task not found when update after task assignment status updated');
    }

    const taskAssignments = await this.taskAssignmentsRepository.findBy({ task });

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

    this.tasksRepository.save(task);
  }

  private async getTaskAssignment(task: Task, user: User) {
    const taskAssignment = task.taskAssignments?.find((assignment: TaskAssignment) => assignment.user.id === user.id);
    if (!taskAssignment) {
      throw new TaskAssignmentNotFoundException();
    }
    return taskAssignment;
  }

  private async updateAssignmentStatusAndTaskStatus(
    task: Task,
    taskAssignment: TaskAssignment,
    status:
      | TaskAssignmentStatus.ACCEPTED
      | TaskAssignmentStatus.REJECTED
      | TaskAssignmentStatus.PENDING
      | TaskAssignmentStatus.DONE,
  ): Promise<TaskStatusResponse> {
    await this.taskAssignmentsRepository.update(taskAssignment.id, { assigneeStatus: status });
    await this.updateTaskStatusBasedOnAssignments(task);

    const updatedTask = await this.tasksRepository.findOneBy({ id: task.id });
    if (!updatedTask) {
      throw new Error('Task not found when update after task assignment status updated');
    }
    const updatedTaskAssignments = updatedTask.taskAssignments;

    if (!updatedTaskAssignments) {
      throw new Error('Task or task assignment not found when update after task assignment status updated');
    }
    return { taskStatus: updatedTask.status, taskAssignments: updatedTaskAssignments };
  }
}
