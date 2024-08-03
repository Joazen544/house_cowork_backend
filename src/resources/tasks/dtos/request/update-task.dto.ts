import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TaskPublicStatus, TaskStatus } from 'src/resources/tasks/entities/task.entity';

export class UpdateTaskDto {
  @IsString()
  @ApiProperty({ example: 'Take out the trash' })
  title!: string;

  @IsString()
  @ApiProperty({ example: 'Every week.' })
  description!: string;

  @IsEnum(TaskPublicStatus)
  @ApiProperty({ example: 0, enum: TaskPublicStatus })
  publicStatus!: TaskPublicStatus;

  @IsDate()
  @Type(() => Date)
  dueTime!: Date;

  @IsArray()
  @IsNumber({}, { each: true })
  assigneesId!: number[];
}
