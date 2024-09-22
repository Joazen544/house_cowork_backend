import { ApiProperty } from '@nestjs/swagger';
import { TaskAssignmentDto } from '../task-assignment.dto';

export class AssignTaskResponseDto {
  @ApiProperty({ type: [TaskAssignmentDto] })
  assignments!: TaskAssignmentDto[];
}
