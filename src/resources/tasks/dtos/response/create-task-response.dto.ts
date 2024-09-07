import { TaskDto } from '../task.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskResponseDto {
  // TODO: response all data as id
  @ApiProperty({ type: TaskDto })
  task!: TaskDto;
}
