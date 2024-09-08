import { ApiProperty } from '@nestjs/swagger';
import { TaskInResponseDto } from '../task-in-response.dto';

export class CreateTaskResponseDto {
  @ApiProperty({ type: TaskInResponseDto })
  task!: TaskInResponseDto;
}
