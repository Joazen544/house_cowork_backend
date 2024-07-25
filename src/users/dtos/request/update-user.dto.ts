import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Kevin',
  })
  @IsString()
  @IsOptional()
  name!: string;

  @ApiProperty({
    example: 'Handsome boy',
  })
  @IsString()
  @IsOptional()
  nickName!: string;

  @ApiProperty({
    example: 'https://image/url',
  })
  @IsString()
  @IsOptional()
  avatar!: string;
}
