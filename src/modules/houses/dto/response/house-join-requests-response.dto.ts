import { ApiProperty } from '@nestjs/swagger';
import { JoinRequestDto } from '../join-request.dto';

export class HouseJoinRequestsResponseDto {
  @ApiProperty({ type: [JoinRequestDto] })
  joinRequests!: JoinRequestDto[];
}
