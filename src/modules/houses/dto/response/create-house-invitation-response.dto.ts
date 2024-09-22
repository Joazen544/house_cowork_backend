import { ApiProperty } from '@nestjs/swagger';

export class CreateHouseInvitationResponseDto {
  @ApiProperty({ example: 'fdwghhf3' })
  invitationCode!: string;
}
