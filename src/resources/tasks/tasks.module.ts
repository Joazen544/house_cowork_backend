import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { UsersModule } from 'src/resources/users/users.module';
import { HousesModule } from 'src/resources/houses/houses.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule, HousesModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
