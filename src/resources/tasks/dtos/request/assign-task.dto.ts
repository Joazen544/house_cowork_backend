import { IsArray, IsNumber } from 'class-validator';

export class AssignTaskDto {
  @IsArray()
  @IsNumber({}, { each: true })
  userIds!: number[];
}
