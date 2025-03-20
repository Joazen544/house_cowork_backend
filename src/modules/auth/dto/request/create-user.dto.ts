import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'kevin@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'password123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    example: 'password123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  passwordConfirm!: string;

  @ApiProperty({
    example: 'Kevin',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
