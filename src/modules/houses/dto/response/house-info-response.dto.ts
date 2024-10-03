import { ApiProperty } from '@nestjs/swagger';
import { HouseInResponseDto } from './house-in-response.dto';
import { Expose } from 'class-transformer';

export class HouseInfoResponseDto {
  @ApiProperty({ type: HouseInResponseDto })
  @Expose()
  house!: HouseInResponseDto;
}
