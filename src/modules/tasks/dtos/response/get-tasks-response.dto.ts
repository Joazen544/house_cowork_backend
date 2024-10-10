import { ApiProperty } from '@nestjs/swagger';
import { TaskInResponseDto } from '../task-in-response.dto';
import { Expose, Type } from 'class-transformer';

export class GetTasksResponseDto {
  @ApiProperty({ type: [TaskInResponseDto] })
  @Expose()
  @Type(() => TaskInResponseDto)
  tasks!: TaskInResponseDto[];
}
