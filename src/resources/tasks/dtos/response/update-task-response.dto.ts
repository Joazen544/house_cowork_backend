import { ApiProperty } from '@nestjs/swagger';
import { TaskInResponseDto } from './task-in-response.dto';

export class UpdateTaskResponseDto {
  @ApiProperty({ type: TaskInResponseDto })
  task!: TaskInResponseDto;
}
