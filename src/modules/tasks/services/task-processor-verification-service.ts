import { Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { TaskAssignmentsRepository } from '../repositories/task-assignments.repository';
import { TaskAssignmentStatus } from '../entities/task-assignment.entity';

@Injectable()
export class TaskProcessorVerificationService {
  constructor(private readonly taskAssignmentsRepository: TaskAssignmentsRepository) {}

  async isUserProcessorOfTask(user: User, task: Task): Promise<boolean> {
    const taskAssignment = await this.taskAssignmentsRepository.findOneBy({
      user,
      task,
    });

    if (!taskAssignment) {
      return false;
    }

    const taskAssignmentStatus = taskAssignment.assigneeStatus;

    return taskAssignmentStatus === TaskAssignmentStatus.ACCEPTED;
  }
}
