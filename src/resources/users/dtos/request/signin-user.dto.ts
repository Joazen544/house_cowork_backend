import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninUserDto {
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
}
