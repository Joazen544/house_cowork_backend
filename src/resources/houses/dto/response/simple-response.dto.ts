import { ApiProperty } from '@nestjs/swagger';

export class SimpleResponseDto {
  @ApiProperty({ example: true })
  result!: boolean;
}
