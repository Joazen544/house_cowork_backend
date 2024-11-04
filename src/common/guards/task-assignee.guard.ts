import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TasksService } from '../../modules/tasks/services/tasks.service';
import { TaskAssigneeVerificationService } from '../../modules/tasks/services/task-assignee-verification-service';

@Injectable()
export class TaskAssigneeGuard implements CanActivate {
  constructor(
    private readonly tasksService: TasksService,
    private readonly taskAssigneeVerificationService: TaskAssigneeVerificationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const taskId = request.params.taskId;

    if (!user || !taskId) {
      throw new ForbiddenException('User or task not found');
    }

    const task = await this.tasksService.findOne({ id: taskId });
    if (!task) {
      throw new ForbiddenException('Task not found');
    }

    const isAssignee = await this.taskAssigneeVerificationService.isUserAssigneeOfTask(user, task);
    if (!isAssignee) {
      throw new ForbiddenException('User is not assignee of this task');
    }

    request.currentTask = task;
    return true;
  }
}
