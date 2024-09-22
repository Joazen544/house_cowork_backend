import { IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum JoinRequestStatus {
  PENDING = 0,
  ACCEPT = 1,
  REJECT = 2,
}

export class JoinRequestDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id!: number;

  @ApiProperty({ example: 14 })
  @IsNumber()
  houseId!: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  userId!: number;

  @ApiProperty({ example: 0 })
  @IsEnum(JoinRequestStatus)
  status!: JoinRequestStatus;
}
