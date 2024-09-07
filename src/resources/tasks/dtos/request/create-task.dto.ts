import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { InheritApiProperty } from 'src/decorators/inherit-api-property.decorator';
import { TaskAccessLevel } from 'src/resources/tasks/entities/task.entity';
import { TaskDto } from '../task.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @InheritApiProperty(TaskDto)
  title!: string;

  @IsString()
  @InheritApiProperty(TaskDto)
  description!: string;

  @IsEnum(TaskAccessLevel)
  @IsNotEmpty()
  @InheritApiProperty(TaskDto)
  accessLevel!: TaskAccessLevel;

  @IsDate()
  @IsNotEmpty()
  @InheritApiProperty(TaskDto)
  @Type(() => Date)
  dueTime!: Date;

  // TODO: check why this is not shown on swagger
  @IsArray()
  @ApiProperty({ example: [1, 2] })
  @IsNumber({}, { each: true })
  assigneesId!: number[];
}
