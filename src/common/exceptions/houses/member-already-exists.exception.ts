export class MemberAlreadyExistsException extends Error {
  constructor() {
    super('User is already a member of the house');
  }
}
