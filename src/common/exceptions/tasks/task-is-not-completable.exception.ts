export class TaskIsNotCompletableException extends Error {
  constructor() {
    super('User need to be task processor to complete the task');
  }
}
