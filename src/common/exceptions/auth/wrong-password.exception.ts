export class WrongPasswordException extends Error {
  constructor() {
    super('Wrong password');
  }
}
