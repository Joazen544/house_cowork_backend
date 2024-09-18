import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './services/tasks.service';
import { Task } from './entities/task.entity';
import { UsersModule } from 'src/resources/users/users.module';
import { HousesModule } from 'src/resources/houses/houses.module';
import { TaskAssignment } from './entities/task-assignment.entity';
import { TasksRepository } from './repositories/tasks.repository';
import { TaskAssignmentsRepository } from './repositories/task-assignments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskAssignment]), UsersModule, HousesModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, TaskAssignmentsRepository],
})
export class TasksModule {}
