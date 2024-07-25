import { ApiProperty } from '@nestjs/swagger';
import { HouseDto } from '../house.dto';

export class HouseInfoResponseDto {
  @ApiProperty({ type: HouseDto })
  house!: HouseDto;
}
