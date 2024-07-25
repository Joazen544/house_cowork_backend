import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HouseDto } from '../house.dto';

export class CreateHouseResponseDto {
  @ApiProperty({ type: HouseDto })
  house!: HouseDto;
}
