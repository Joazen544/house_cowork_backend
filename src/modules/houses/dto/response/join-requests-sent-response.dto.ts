import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { JoinRequestSentDto } from '../join-request-sent.dto';

export class JoinRequestsSentResponseDto {
  @ApiProperty({ type: [JoinRequestSentDto] })
  @Expose()
  @Type(() => JoinRequestSentDto)
  joinRequests!: JoinRequestSentDto[];
}
