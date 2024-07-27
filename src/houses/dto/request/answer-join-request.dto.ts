import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AnswerJoinRequestResult } from '../response/answer-join-request-response.dto';

export class AnswerJoinRequestDto {
  @ApiProperty({ example: 'accept', enum: AnswerJoinRequestResult })
  @IsEnum(AnswerJoinRequestResult)
  @IsNotEmpty()
  result!: AnswerJoinRequestResult;
}
