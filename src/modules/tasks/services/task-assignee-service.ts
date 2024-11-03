import { Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { TaskAssignmentsRepository } from '../repositories/task-assignments.repository';

@Injectable()
export class TaskAssigneeService {
  constructor(private readonly taskAssignmentsRepository: TaskAssignmentsRepository) {}

  async isUserAssigneeOfTask(user: User, task: Task): Promise<boolean> {
    const taskAssignment = await this.taskAssignmentsRepository.findOneBy({
      user,
      task,
    });

    return !!taskAssignment;
  }
}
