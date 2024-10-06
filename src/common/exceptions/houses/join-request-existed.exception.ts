export class JoinRequestExistedException extends Error {
  constructor() {
    super('A pending join request already exists.');
  }
}
