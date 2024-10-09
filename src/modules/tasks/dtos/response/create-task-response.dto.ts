import { ApiProperty } from '@nestjs/swagger';
import { TaskInResponseDto } from '../task-in-response.dto';
import { Expose } from 'class-transformer';

export class CreateTaskResponseDto {
  @ApiProperty({ type: TaskInResponseDto })
  @Expose()
  task!: TaskInResponseDto;
}
