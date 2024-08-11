import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../../users/dtos/user.dto';
import { Expose } from 'class-transformer';

export class CreateUserResponseDto {
  @Expose()
  @ApiProperty({ type: UserDto })
  user!: UserDto;

  @Expose()
  @ApiProperty({
    example:
      'yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6joiYXJ0aHVIjoxNjEzNTY3MzA0fQ.6EPCOfBGynidAfpVqlvbHGWHCJ5LZLtKvPaQ',
  })
  accessToken!: string;
}
