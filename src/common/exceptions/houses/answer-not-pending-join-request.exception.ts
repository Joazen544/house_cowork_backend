export class AnswerNotPendingJoinRequestException extends Error {
  constructor() {
    super('Can only answer pending join requests');
  }
}
