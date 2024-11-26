import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { InheritApiProperty } from '../../../../common/decorators/inherit-api-property.decorator';
import { TaskAccessLevel } from '../../entities/task.entity';
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
}
