import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TasksService } from '../resources/tasks/services/tasks.service';

@Injectable()
export class TaskOwnerGuard implements CanActivate {
  constructor(private readonly tasksService: TasksService) {}

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

    const isOwner = await this.tasksService.isUserOwnerOfTask(user, task);
    if (!isOwner) {
      throw new ForbiddenException('User is not owner of this task');
    }

    request.currentTask = task;
    return true;
  }
}
