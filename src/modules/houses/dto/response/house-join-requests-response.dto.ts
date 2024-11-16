import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { JoinRequestOfHouseDto } from '../join-request-of-house.dto';

export class HouseJoinRequestsResponseDto {
  @ApiProperty({ type: [JoinRequestOfHouseDto] })
  @Expose()
  @Type(() => JoinRequestOfHouseDto)
  joinRequests!: JoinRequestOfHouseDto[];
}
