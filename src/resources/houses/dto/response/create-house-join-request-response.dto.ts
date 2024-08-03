import { ApiProperty } from '@nestjs/swagger';
import { HouseDto } from '../house.dto';

export class CreateHouseJoinRequestResponseDto {
  @ApiProperty({ type: HouseDto })
  house!: HouseDto;
}
