import { ApiProperty } from '@nestjs/swagger';
import { TaskAssignmentDto } from '../task-assignment.dto';
import { Expose, Type } from 'class-transformer';

export class AssignTaskResponseDto {
  @Expose()
  @ApiProperty({ type: [TaskAssignmentDto] })
  @Type(() => TaskAssignmentDto)
  assignments!: TaskAssignmentDto[];
}
