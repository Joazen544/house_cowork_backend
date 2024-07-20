import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../user.dto';

export class CreateUserDto {
  @ApiProperty({ type: UserDto })
  user!: UserDto;

  @ApiProperty({
    example:
      'yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6joiYXJ0aHVIjoxNjEzNTY3MzA0fQ.6EPCOfBGynidAfpVqlvbHGWHCJ5LZLtKvPaQ',
  })
  accessToken!: string;
}
