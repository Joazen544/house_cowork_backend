import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { InheritApiProperty } from 'src/decorators/inherit-api-property.decorator';
import { TaskAccessLevel } from 'src/resources/tasks/entities/task.entity';
import { TaskDto } from '../task.dto';

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

  @IsArray()
  @InheritApiProperty(TaskDto)
  @IsNumber({}, { each: true })
  assigneesId!: number[];
}
