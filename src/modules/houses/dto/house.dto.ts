import { IsArray, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dtos/user.dto';
import { Expose } from 'class-transformer';

export class HouseDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Expose()
  id!: number;

  @ApiProperty({ example: 'No 10 Floor 5' })
  @IsString()
  @Expose()
  name!: string;

  @ApiProperty({ example: 'This is a warm house' })
  @Expose()
  @IsString()
  description!: string;

  @ApiProperty({ example: 'https://example.com/house.jpg' })
  @Expose()
  @IsString()
  avatar!: string;

  @ApiProperty({ example: ['Pay the rent on 5th', 'Be clean', 'Be happy', 'Dogs and cats are welcome'] })
  @Expose()
  @IsArray()
  @IsString({ each: true })
  rules!: string[];

  @ApiProperty({ type: [UserDto] })
  @Expose()
  @IsArray()
  members!: UserDto[];
}
