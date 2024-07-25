import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHouseResponseDto {
  @ApiProperty({ example: 'No 10 Floor 5' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'This is a warm house' })
  @IsString()
  description!: string;

  @ApiProperty({ example: ['Pay the rent on 5th', 'Be clean', 'Be happy', 'Dogs and cats are welcome'] })
  @IsArray()
  @IsString({ each: true })
  rules!: string[];
}
