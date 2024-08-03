import { TaskDto } from '../task.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TasksResponseDto {
  @ApiProperty({ type: [TaskDto] })
  tasks!: TaskDto[];
}
