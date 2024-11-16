import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { JoinRequestSentDto } from '../join-request-sent.dto';

export class CreateJoinRequestResponseDto {
  @ApiProperty({ type: JoinRequestSentDto })
  @Expose()
  joinRequest!: JoinRequestSentDto;
}
