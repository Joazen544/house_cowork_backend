import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Kevin' })
  @IsString()
  @Expose()
  name!: string;

  @ApiProperty({ example: 'Handsome boy' })
  @IsString()
  @Expose()
  nickName!: string;

  @ApiProperty({ example: 'https://image/url' })
  @IsString()
  @Expose()
  avatar!: string;
}