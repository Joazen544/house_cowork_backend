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
import { TaskAssigneeService } from './services/task-assignee-service';
import { RespondToTaskService } from './services/respond-to-task-service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskAssignment]), UsersModule, HousesModule],
  controllers: [TasksController],
  providers: [TasksService, TaskAssigneeService, RespondToTaskService, TasksRepository, TaskAssignmentsRepository],
})
export class TasksModule {}
