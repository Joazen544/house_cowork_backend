import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { TaskAssignmentStatus } from '../entities/task-assignment.entity';

export class TaskAssignmentDto {
  @IsNumber()
  @Expose()
  @ApiProperty({ example: 1 })
  assigneeId!: number;

  @Expose()
  @ApiProperty({
    example: 0,
    enum: TaskAssignmentStatus,
    enumName: 'TaskAssignmentStatus',
    description: `Task assignment status:\n
    ${TaskAssignmentStatus.PENDING} - PENDING,\n
    ${TaskAssignmentStatus.ACCEPTED} - ACCEPTED,\n
    ${TaskAssignmentStatus.REJECTED} - REJECTED,\n
    ${TaskAssignmentStatus.CANCELLED} - CANCELLED`,
  })
  assigneeStatus!: TaskAssignmentStatus;
}
