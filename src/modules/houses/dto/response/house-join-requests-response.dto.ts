import { ApiProperty } from '@nestjs/swagger';
import { JoinRequestDto } from '../join-request.dto';
import { Expose, Type } from 'class-transformer';

export class HouseJoinRequestsResponseDto {
  @ApiProperty({ type: [JoinRequestDto] })
  @Expose()
  @Type(() => JoinRequestDto)
  joinRequests!: JoinRequestDto[];
}
