import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../user.dto';
import { Expose } from 'class-transformer';

export class UserInfoResponseDto {
  @ApiProperty({ type: UserDto })
  @Expose()
  user!: UserDto;
}
