import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

enum AnswerJoinRequestResult {
  ACCEPT = 'accept',
  REJECT = 'reject',
}

export class AnswerJoinRequestDto {
  @ApiProperty({ example: 'accept', enum: AnswerJoinRequestResult })
  @IsEnum(AnswerJoinRequestResult)
  @IsNotEmpty()
  result!: AnswerJoinRequestResult;
}
