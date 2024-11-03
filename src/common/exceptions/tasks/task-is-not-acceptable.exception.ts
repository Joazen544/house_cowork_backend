import { TaskStatus } from 'src/modules/tasks/entities/task.entity';

export class TaskIsNotAcceptableException extends Error {
  constructor(availableTaskStatuses: TaskStatus[]) {
    super(`Task should be in one of the following statuses: ${availableTaskStatuses.join(', ')}`);
  }
}
