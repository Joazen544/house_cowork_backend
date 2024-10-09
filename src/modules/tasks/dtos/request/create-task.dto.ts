import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { InheritApiProperty } from '../../../../common/decorators/inherit-api-property.decorator';
import { TaskAccessLevel } from '../../entities/task.entity';
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

  @IsArray()
  @ApiProperty({ example: [1, 2] })
  @IsNumber({}, { each: true })
  assigneeIds!: number[];
}
