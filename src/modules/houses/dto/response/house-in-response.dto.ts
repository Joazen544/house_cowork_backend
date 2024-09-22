import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { HouseDto } from '../house.dto';

export class HouseInResponseDto extends OmitType(HouseDto, ['members'] as const) {
  @Expose()
  @ApiProperty({ example: [1, 2] })
  membersId!: number[];
}
