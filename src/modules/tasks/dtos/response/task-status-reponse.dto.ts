import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TaskStatus } from '../../entities/task.entity';
import { TaskAssignmentDto } from '../task-assignment.dto';

class TaskStatusResponse {
  @Expose()
  @ApiProperty({ type: String })
  taskStatus!: TaskStatus;

  @Expose()
  @ApiProperty({ type: [TaskAssignmentDto] })
  @Type(() => TaskAssignmentDto)
  taskAssignments!: TaskAssignmentDto[];
}

export class TaskStatusResponseDto {
  @Expose()
  @ApiProperty({ type: TaskStatusResponse })
  @Type(() => TaskStatusResponse)
  result!: TaskStatusResponse;
}
