import { ApiProperty } from '@nestjs/swagger';
import { HouseDto } from '../house.dto';
import { JoinRequestDto } from '../join-request.dto';

export class HouseJoinRequestsResponseDto {
  @ApiProperty({ type: HouseDto })
  house!: HouseDto;

  @ApiProperty({ type: JoinRequestDto })
  joinRequest!: JoinRequestDto;
}
