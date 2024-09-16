import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TasksService } from '../services/tasks.service';
import {
  TaskAssignmentStatusUpdatedEvent,
  TaskAssignmentStatusUpdatedEventName,
} from '../../../events/task-assignment-status-updated.event';

@Injectable()
export class TaskListener {
  constructor(private tasksService: TasksService) {}

  @OnEvent(TaskAssignmentStatusUpdatedEventName)
  handleTaskAssignmentStatusUpdated(event: TaskAssignmentStatusUpdatedEvent) {
    this.tasksService.updateTaskStatusBasedOnAssignments(event.task);
  }
}
