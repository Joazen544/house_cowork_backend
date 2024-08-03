import { IsString } from 'class-validator';
import { TaskDto } from '../task.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskResponseDto {
  @ApiProperty({ type: TaskDto })
  task!: TaskDto;
}
