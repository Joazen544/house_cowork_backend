import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class InvitationDto {
  @ApiProperty({ example: 'fdwghhf3' })
  @Expose()
  invitationCode!: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  expiresAt!: Date;
}

export class CreateHouseInvitationResponseDto {
  @ApiProperty({ type: InvitationDto })
  @Expose()
  invitation!: InvitationDto;
}
