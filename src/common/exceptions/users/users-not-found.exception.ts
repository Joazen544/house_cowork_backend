export class UsersNotFoundException extends Error {
  constructor() {
    super('One or more users not found');
  }
}
