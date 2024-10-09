export class UserNotMemberOfHouseException extends Error {
  constructor() {
    super('User is not a member of the house');
  }
}
