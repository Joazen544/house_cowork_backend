import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { InheritApiProperty } from 'src/decorators/inherit-api-property.decorator';
import { TaskAccessLevel } from 'src/resources/tasks/entities/task.entity';
import { TaskDto } from '../task.dto';

export class UpdateTaskDto {
  @IsString()
  @InheritApiProperty(TaskDto)
  title!: string;

  @IsString()
  @InheritApiProperty(TaskDto)
  description!: string;

  @IsEnum(TaskAccessLevel)
  @InheritApiProperty(TaskDto)
  accessLevel!: TaskAccessLevel;

  @IsDate()
  @Type(() => Date)
  @InheritApiProperty(TaskDto)
  dueTime!: Date;

  @IsArray()
  @IsNumber({}, { each: true })
  @InheritApiProperty(TaskDto)
  assigneesId!: number[];
}
