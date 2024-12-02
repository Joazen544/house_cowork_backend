import { Injectable } from '@nestjs/common';
import { TaskAssignmentsRepository } from '../repositories/task-assignments.repository';
import { TaskAssignmentStatus } from '../entities/task-assignment.entity';

@Injectable()
export class TaskProcessorVerificationService {
  constructor(private readonly taskAssignmentsRepository: TaskAssignmentsRepository) {}

  async isUserProcessorOfTask(userId: number, taskId: number): Promise<boolean> {
    const taskAssignment = await this.taskAssignmentsRepository.findOneBy({
      userId,
      taskId,
    });

    if (!taskAssignment) {
      return false;
    }

    const taskAssignmentStatus = taskAssignment.assigneeStatus;

    return taskAssignmentStatus === TaskAssignmentStatus.ACCEPTED;
  }
}
