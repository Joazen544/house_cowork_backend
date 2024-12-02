import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class TaskStatusResponseDto {
  @Expose()
  @ApiProperty({ type: [TaskStatusResponseDto] })
  @Type(() => TaskStatusResponseDto)
  result!: TaskStatusResponseDto;
}
