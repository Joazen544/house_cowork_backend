import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TaskPublicStatus } from 'src/tasks/entities/task.entity';

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
  @ApiProperty({ example: 0, enum: TaskPublicStatus })
  publicStatus!: TaskPublicStatus;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  dueTime!: Date;

  @IsArray()
  @IsNumber({}, { each: true })
  assigneesId!: number[];
}
