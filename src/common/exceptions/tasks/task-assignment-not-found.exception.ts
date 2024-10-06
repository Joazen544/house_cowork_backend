export class TaskAssignmentNotFoundException extends Error {
  constructor() {
    super('Task assignment not found');
  }
}
