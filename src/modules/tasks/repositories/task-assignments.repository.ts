import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { TaskAssignment } from '../entities/task-assignment.entity';

@Injectable()
export class TaskAssignmentsRepository {
  constructor(@InjectRepository(TaskAssignment) private readonly taskAssignmentRepo: Repository<TaskAssignment>) {}

  createMultiple(taskAssignments: TaskAssignment[]) {
    return this.saveMany(taskAssignments);
  }

  findOne(attrs: FindOptionsWhere<TaskAssignment>) {
    return this.taskAssignmentRepo.findOne({ where: attrs });
  }

  findMany(attrs: FindOptionsWhere<TaskAssignment>) {
    return this.taskAssignmentRepo.find({ where: attrs });
  }

  update(taskAssignment: TaskAssignment, attrsToUpdate: Partial<TaskAssignment>) {
    return this.taskAssignmentRepo.update({ id: taskAssignment.id }, attrsToUpdate);
  }

  async saveOne(taskAssignment: TaskAssignment) {
    return this.taskAssignmentRepo.save(taskAssignment);
  }

  async saveMany(taskAssignments: TaskAssignment[]) {
    return this.taskAssignmentRepo.save(taskAssignments);
  }
}
