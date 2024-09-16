import { Injectable } from '@nestjs/common';
import { TaskAssignment, TaskAssignmentStatus } from '../entities/task-assignment.entity';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskAssignmentsRepository } from '../repositories/task-assignments.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  TaskAssignmentStatusUpdatedEventName,
  TaskAssignmentStatusUpdatedEvent,
} from '../../../events/task-assignment-status-updated.event';
import { Task } from '../entities/task.entity';

@Injectable()
export class TaskAssignmentsService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly taskAssignmentsRepository: TaskAssignmentsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  updateStatus(task: Task, assignment: TaskAssignment, newStatus: TaskAssignmentStatus) {
    assignment.assigneeStatus = newStatus;
    this.taskAssignmentsRepository.saveOne(assignment);

    this.eventEmitter.emit(
      TaskAssignmentStatusUpdatedEventName,
      new TaskAssignmentStatusUpdatedEvent(task, assignment, newStatus),
    );
  }
}
