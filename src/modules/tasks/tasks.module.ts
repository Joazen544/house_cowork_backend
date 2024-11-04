import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './services/tasks.service';
import { Task } from './entities/task.entity';
import { UsersModule } from '../users/users.module';
import { HousesModule } from '../houses/houses.module';
import { TaskAssignment } from './entities/task-assignment.entity';
import { TasksRepository } from './repositories/tasks.repository';
import { TaskAssignmentsRepository } from './repositories/task-assignments.repository';
import { TaskAssigneeVerificationService } from './services/task-assignee-verification-service';
import { RespondToTaskService } from './services/respond-to-task-service';
import { TaskProcessorVerificationService } from './services/task-processor-verification-service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskAssignment]), UsersModule, HousesModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    TaskAssigneeVerificationService,
    RespondToTaskService,
    TasksRepository,
    TaskAssignmentsRepository,
    TaskProcessorVerificationService,
  ],
})
export class TasksModule {}
