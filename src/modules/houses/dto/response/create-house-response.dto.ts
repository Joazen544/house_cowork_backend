import { ApiProperty } from '@nestjs/swagger';
import { HouseInResponseDto } from './house-in-response.dto';

export class CreateHouseResponseDto {
  @ApiProperty({ type: HouseInResponseDto })
  house!: HouseInResponseDto;
}
