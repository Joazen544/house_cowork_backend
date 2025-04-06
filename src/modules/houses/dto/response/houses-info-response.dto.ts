import { ApiProperty } from '@nestjs/swagger';
import { HouseInResponseDto } from './house-in-response.dto';
import { Expose, Type } from 'class-transformer';

export class HousesInfoResponseDto {
  @ApiProperty({ type: [HouseInResponseDto] })
  @Expose()
  @Type(() => HouseInResponseDto)
  houses!: HouseInResponseDto[];
}
