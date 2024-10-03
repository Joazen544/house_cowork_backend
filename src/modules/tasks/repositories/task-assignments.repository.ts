import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { TaskAssignment } from '../entities/task-assignment.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class TaskAssignmentsRepository extends BaseRepository<TaskAssignment> {
  constructor(
    @InjectRepository(TaskAssignment) private readonly taskAssignmentRepo: Repository<TaskAssignment>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(TaskAssignment, dataSource);
  }

  createMultiple(taskAssignments: TaskAssignment[]) {
    return this.saveMany(taskAssignments);
  }
}
