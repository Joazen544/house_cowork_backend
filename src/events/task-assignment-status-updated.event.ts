import { TaskAssignment, TaskAssignmentStatus } from 'src/resources/tasks/entities/task-assignment.entity';
import { Task } from 'src/resources/tasks/entities/task.entity';

export const TaskAssignmentStatusUpdatedEventName = 'task-assignment-status-updated';

export class TaskAssignmentStatusUpdatedEvent {
  constructor(
    public readonly task: Task,
    public readonly assignment: TaskAssignment,
    public readonly newStatus: TaskAssignmentStatus,
  ) {}
}
