import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { JoinRequestStatus } from '../entities/join-request.entity';

export class JoinRequestSentDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: JoinRequestStatus.PENDING })
  @Expose()
  status!: JoinRequestStatus;

  @ApiProperty({ example: 'House Name' })
  @Expose()
  houseName!: string;
}
