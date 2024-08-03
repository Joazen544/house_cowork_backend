import { Expose, Transform, plainToClass } from 'class-transformer';
import { User } from '../../../users/entities/user.entity';
import { UserDto } from 'src/users/dtos/user.dto';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HouseDto } from 'src/houses/dto/house.dto';
import { TaskPublicStatus, TaskStatus } from '../entities/task.entity';

export class TaskDto {
  @Expose()
  @IsNumber()
  @ApiProperty({ example: 1 })
  id!: number;

  @Expose()
  @Transform(({ value }) => plainToClass(UserDto, value), { toClassOnly: true })
  @IsNotEmpty()
  @ApiProperty({ type: UserDto })
  owner!: UserDto;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Take out the trash' })
  title!: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'Every week.' })
  description!: string;

  @Expose()
  @IsEnum(TaskPublicStatus)
  @IsNotEmpty()
  @ApiProperty({ example: 0, enum: TaskPublicStatus })
  publicStatus!: TaskPublicStatus;

  @Expose()
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  @ApiProperty({ example: 1, enum: TaskStatus })
  status!: TaskStatus;

  @Expose()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: 'The date and time when the task was created', example: '2023-07-28T14:30:00Z' })
  dueTime!: Date;

  @Expose()
  @Transform(({ value }) => value.map((assignee: User) => plainToClass(UserDto, assignee)), { toClassOnly: true })
  @ApiProperty({ type: [UserDto] })
  assignees!: UserDto[];

  @Expose()
  @Transform(({ value }) => plainToClass(HouseDto, value), { toClassOnly: true })
  @IsNotEmpty()
  @ApiProperty({ type: HouseDto })
  house!: HouseDto;
}
