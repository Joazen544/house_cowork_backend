export class TaskIsNotRejectableException extends Error {
  constructor() {
    super('Task is either accepted, done or cancelled');
  }
}
