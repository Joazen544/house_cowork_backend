import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { TaskDto } from '../task.dto';

export class TaskInResponseDto extends OmitType(TaskDto, ['owner', 'assignees', 'house'] as const) {
  @IsNumber()
  @Expose()
  @ApiProperty({ example: 1 })
  ownerId!: number;

  @Expose()
  @ApiProperty({ example: [1, 2] })
  assigneesId!: number[];
}
