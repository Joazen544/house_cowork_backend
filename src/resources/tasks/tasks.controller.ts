import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Query, Patch, Delete } from '@nestjs/common';
import { CreateTaskDto } from './dtos/request/create-task.dto';
import { TasksService } from './tasks.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from 'src/resources/users/entities/user.entity';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestErrorResponseDto,
  ForbiddenErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/dto/errors/errors.dto';
import { CreateTaskResponseDto } from './dtos/response/create-task-response.dto';
import { HouseMemberGuard } from 'src/guards/house-member.guard';
import { GetTasksResponseDto } from './dtos/response/get-tasks-response.dto';
import { CurrentHouse } from '../houses/decorators/current-house.decorator';
import { House } from '../houses/entities/house.entity';
import { TaskOwnerGuard } from 'src/guards/task-owner.guard';
import { CurrentTask } from './decorators/current-task.decorator';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dtos/request/update-task.dto';
import { SimpleResponseDto } from '../../dto/response/simple-response.dto';
import { AssignTaskDto } from './dtos/request/assign-task.dto';
import { TaskAssignmentStatus } from './entities/task-assignment.entity';
import { TaskAssigneeGuard } from 'src/guards/task-assignee.guard';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('house/:houseId')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Create a task' })
  @ApiResponse({ status: 201, description: 'Task created.', type: CreateTaskResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, some property is missed.', type: BadRequestErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to create a house.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only house member can create task.', type: ForbiddenErrorResponseDto })
  @ApiBody({ type: CreateTaskDto })
  @Serialize(CreateTaskResponseDto)
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get('house/:houseId')
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Get tasks from a house.' })
  @ApiQuery({ name: 'timeStart', required: false, type: String, example: '2024-07-11' })
  @ApiQuery({ name: 'timeEnd', required: false, type: String, example: '2024-07-15' })
  @ApiQuery({ name: 'ownerId', required: false, type: String, example: '2' })
  @ApiQuery({ name: 'assigneeId', required: false, type: String, example: '2' })
  @ApiQuery({
    name: 'assigneeStatus',
    required: false,
    enum: TaskAssignmentStatus,
    example: TaskAssignmentStatus.PENDING,
    description: 'Task assignment status: 0 for PENDING, 1 for ACCEPTED, 2 for REJECTED, 3 for CANCELLED',
  })
  @ApiResponse({ status: 200, description: 'Task created.', type: GetTasksResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to get tasks.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only house member can get task.', type: ForbiddenErrorResponseDto })
  find(@Query('timeStart') timeStart: string, @Query('timeEnd') timeEnd: string, @CurrentHouse() house: House) {
    let startDate: Date;

    if (timeStart) {
      startDate = new Date(timeStart);
    } else {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 40);
    }
    const endDate = timeEnd ? new Date(timeEnd) : null;

    return this.tasksService.findByDatePeriod(startDate, endDate, house);
  }

  @Patch(':taskId')
  @ApiBearerAuth()
  @UseGuards(TaskOwnerGuard)
  @ApiOperation({ summary: 'Update a task.' })
  @ApiResponse({ status: 200, description: 'Task updated.', type: CreateTaskResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to update task.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only task owner can update the task.', type: ForbiddenErrorResponseDto })
  update(@Body() updateTaskDto: UpdateTaskDto, @CurrentTask() task: Task) {
    return this.tasksService.update(task, updateTaskDto);
  }

  @Delete(':taskId')
  @ApiBearerAuth()
  @UseGuards(TaskOwnerGuard)
  @ApiOperation({ summary: 'Delete a task.' })
  @ApiResponse({ status: 200, description: 'Task deleted.', type: SimpleResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to delete task.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only task owner can delete the task.', type: ForbiddenErrorResponseDto })
  delete(@CurrentTask() task: Task) {
    return this.tasksService.delete(task);
  }

  @Post(':taskId/assignments')
  @ApiBearerAuth()
  @UseGuards(TaskOwnerGuard)
  @ApiOperation({ summary: 'Assign a task to users.' })
  @ApiResponse({ status: 200, description: 'Task assigned.', type: SimpleResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to assign task.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only task owner can assign the task.', type: ForbiddenErrorResponseDto })
  @ApiBody({ type: AssignTaskDto })
  assign(@CurrentTask() task: Task, @Body() assignTaskDto: AssignTaskDto) {
    return { result: this.tasksService.assign(task, assignTaskDto.assigneeIds) };
  }

  @Patch(':taskId/response')
  @ApiBearerAuth()
  @UseGuards(TaskAssigneeGuard)
  @ApiOperation({ summary: 'Respond to a task assignment.' })
  @ApiResponse({ status: 200, description: 'Task assignment responded.', type: SimpleResponseDto })
  @ApiResponse({
    status: 401,
    description: 'Needs sign in to respond to task assignment.',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Only task assignee can respond to the task assignment.',
    type: ForbiddenErrorResponseDto,
  })
  respond(@CurrentTask() task: Task, @CurrentUser() user: User, @Body('status') status: TaskAssignmentStatus) {
    return { result: this.tasksService.respondToAssignment(task, user, status) };
  }
}
