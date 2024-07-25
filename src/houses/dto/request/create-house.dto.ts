import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHouseDto {
  @ApiProperty({
    example: 'No 10 Floor 5',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'This is a warm house',
  })
  @IsString()
  @IsOptional()
  description!: string;

  @ApiProperty({
    example: ['Pay the rent on 5th', 'Be clean', 'Be happy', 'Dogs and cats are welcome'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  rules!: string[];
}
