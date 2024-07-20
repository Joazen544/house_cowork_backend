import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id!: number;

  @Expose()
  @ApiProperty({ example: 'Kevin' })
  name!: string;

  @Expose()
  @ApiProperty({ example: 'Handsome boy' })
  nickName!: string;

  @Expose()
  @ApiProperty({ example: 'https://image/url' })
  avatar!: string;
}
