import { ApiProperty } from '@nestjs/swagger';
import { TaskInResponseDto } from './task-in-response.dto';

export class GetTasksResponseDto {
  @ApiProperty({ type: [TaskInResponseDto] })
  tasks!: TaskInResponseDto[];
}
