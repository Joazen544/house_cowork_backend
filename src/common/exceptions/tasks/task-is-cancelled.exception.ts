export class TaskIsCancelledException extends Error {
  constructor() {
    super('Task is not able to be responded');
  }
}
