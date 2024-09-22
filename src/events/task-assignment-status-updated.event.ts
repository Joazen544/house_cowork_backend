import { TaskAssignment, TaskAssignmentStatus } from 'src/modules/tasks/entities/task-assignment.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';

export const TaskAssignmentStatusUpdatedEventName = 'task-assignment-status-updated';

export class TaskAssignmentStatusUpdatedEvent {
  constructor(
    public readonly task: Task,
    public readonly assignment: TaskAssignment,
    public readonly newStatus: TaskAssignmentStatus,
  ) {}
}
