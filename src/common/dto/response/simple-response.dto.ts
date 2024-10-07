import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SimpleResponseDto {
  @ApiProperty({ example: true })
  @Expose()
  result!: boolean;
}
