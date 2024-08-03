import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TaskPublicStatus } from 'src/resources/tasks/entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Take out the trash' })
  title!: string;

  @IsString()
  @ApiProperty({ example: 'Every week.' })
  description!: string;

  @IsEnum(TaskPublicStatus)
  @IsNotEmpty()
  @ApiProperty({ description: '0 is for open to all.\n 1 is only for assignees.', example: 0, enum: TaskPublicStatus })
  publicStatus!: TaskPublicStatus;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-07-22' })
  @Type(() => Date)
  dueTime!: Date;

  @IsArray()
  @ApiProperty({ example: [7, 10] })
  @IsNumber({}, { each: true })
  assigneesId!: number[];
}
