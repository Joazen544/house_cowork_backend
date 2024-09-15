import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Injectable } from '@nestjs/common';
import { TaskAssignment } from '../entities/task-assignment.entity';

@Injectable()
export class TaskAssignmentsRepository {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(TaskAssignment) private readonly taskAssignmentRepo: Repository<TaskAssignment>,
  ) {}

  createMultiple(taskAssignments: TaskAssignment[]) {
    return this.taskAssignmentRepo.save(taskAssignments);
  }

  findOne(attrs: FindOptionsWhere<TaskAssignment>) {
    return this.taskAssignmentRepo.findOne({ where: attrs });
  }

  update(taskAssignment: TaskAssignment, attrsToUpdate: Partial<TaskAssignment>) {
    return this.taskAssignmentRepo.update(taskAssignment, attrsToUpdate);
  }
}
