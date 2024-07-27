import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../user.dto';

export class UserInfoResponseDto {
  @ApiProperty({ type: UserDto })
  user!: UserDto;
}
