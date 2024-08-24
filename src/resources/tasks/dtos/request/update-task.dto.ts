import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { TaskAccessLevel } from 'src/resources/tasks/entities/task.entity';

export class UpdateTaskDto {
  @IsString()
  @ApiProperty({ example: 'Take out the trash' })
  title!: string;

  @IsString()
  @ApiProperty({ example: 'Every week.' })
  description!: string;

  @IsEnum(TaskAccessLevel)
  @ApiProperty({ example: 0, enum: TaskAccessLevel })
  publicStatus!: TaskAccessLevel;

  @IsDate()
  @Type(() => Date)
  dueTime!: Date;

  @IsArray()
  @IsNumber({}, { each: true })
  assigneesId!: number[];
}
