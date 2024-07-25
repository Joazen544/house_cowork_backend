import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { TaskDto } from '../tasks/dtos/task.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(TaskDto)
  createTask(@Body() body: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(body, user);
  }
}
