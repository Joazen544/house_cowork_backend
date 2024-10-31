export class UserIsNotAcceptorException extends Error {
  constructor() {
    super('User is not accepting the task.');
  }
}
