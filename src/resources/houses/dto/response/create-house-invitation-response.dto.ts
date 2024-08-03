import { ApiProperty } from '@nestjs/swagger';
import { HouseDto } from '../house.dto';

export class CreateHouseInvitationResponseDto {
  @ApiProperty({ type: HouseDto })
  house!: HouseDto;

  @ApiProperty({ example: 'fdwghhf3' })
  invitationCode!: string;
}
