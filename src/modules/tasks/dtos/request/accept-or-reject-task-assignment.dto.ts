import { IsEnum, IsIn, IsNotEmpty } from 'class-validator';
import { TaskAssignmentStatus } from '../../entities/task-assignment.entity';

export class AcceptOrRejectTaskAssignmentDto {
  @IsEnum(TaskAssignmentStatus)
  @IsNotEmpty()
  @IsIn([TaskAssignmentStatus.ACCEPTED, TaskAssignmentStatus.REJECTED])
  assigneeStatus!: TaskAssignmentStatus;
}
