export class InvitationNotFoundException extends Error {
  constructor() {
    super('Invitation not found');
  }
}
