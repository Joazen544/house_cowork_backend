import { ApiProperty } from '@nestjs/swagger';

export enum AnswerJoinRequestResult {
  ACCEPT = 'accept',
  REJECT = 'reject',
}

export class AnswerJoinRequestResponseDto {
  @ApiProperty({ example: 'accept', enum: AnswerJoinRequestResult })
  result!: AnswerJoinRequestResult;
}
