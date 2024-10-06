export class EmailInUseException extends Error {
  constructor() {
    super('Email in use');
  }
}
