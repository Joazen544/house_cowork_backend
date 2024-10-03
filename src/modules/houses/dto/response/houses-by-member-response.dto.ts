import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HousesByMemberResponseDto {
  @ApiProperty({ type: [Number] })
  @Expose()
  houseIds!: number[];
}
