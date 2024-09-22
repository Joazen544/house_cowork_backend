import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserDto } from '../../../users/dtos/user.dto';
import { Expose } from 'class-transformer';

class TaskInCreateResponseDto extends OmitType(UserDto, ['bankAccount'] as const) {}

export class CreateUserResponseDto {
  @Expose()
  @ApiProperty({ type: TaskInCreateResponseDto })
  user!: TaskInCreateResponseDto;

  @Expose()
  @ApiProperty({
    example:
      'yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6joiYXJ0aHVIjoxNjEzNTY3MzA0fQ.6EPCOfBGynidAfpVqlvbHGWHCJ5LZLtKvPaQ',
  })
  accessToken!: string;
}
