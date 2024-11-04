import { TaskStatus } from 'src/modules/tasks/entities/task.entity';

export class TaskIsNotPendingableException extends Error {
  constructor(availableTaskStatuses: TaskStatus[]) {
    super(`Task is able to be responded only in ${availableTaskStatuses.join(', ')} statuses`);
  }
}
