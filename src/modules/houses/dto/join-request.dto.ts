import { IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserDto } from 'src/modules/users/dtos/user.dto';

enum JoinRequestStatus {
  PENDING = 0,
  ACCEPT = 1,
  REJECT = 2,
}

export class JoinRequestDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Expose()
  id!: number;

  @ApiProperty({ type: UserDto })
  @Expose()
  user!: UserDto;

  @ApiProperty({ example: 0 })
  @IsEnum(JoinRequestStatus)
  @Expose()
  status!: JoinRequestStatus;
}
