export class JoinRequestNotFoundException extends Error {
  constructor() {
    super('Join request not found');
  }
}
