import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/request/create-task.dto';
import { TasksService } from './services/tasks.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestErrorResponseDto,
  ForbiddenErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from '../../common/dto/errors/errors.dto';
import { CreateTaskResponseDto } from './dtos/response/create-task-response.dto';
import { HouseMemberGuard } from '../../common/guards/house-member.guard';
import { GetTasksResponseDto } from './dtos/response/get-tasks-response.dto';
import { CurrentHouse } from '../houses/decorators/current-house.decorator';
import { House } from '../houses/entities/house.entity';
import { TaskOwnerGuard } from '../../common/guards/task-owner.guard';
import { CurrentTask } from './decorators/current-task.decorator';
import { Task, TaskStatus } from './entities/task.entity';
import { UpdateTaskDto } from './dtos/request/update-task.dto';
import { SimpleResponseDto } from '../../common/dto/response/simple-response.dto';
import { AssignTaskDto } from './dtos/request/assign-task.dto';
import { TaskAssignmentStatus } from './entities/task-assignment.entity';
import { TaskAssigneeGuard } from '../../common/guards/task-assignee.guard';
import { AssignTaskResponseDto } from './dtos/response/assign-task-reponse.dto';
import { UsersNotFoundException } from 'src/common/exceptions/users/users-not-found.exception';
import { TaskAssignmentNotFoundException } from 'src/common/exceptions/tasks/task-assignment-not-found.exception';
import { UserNotMemberOfHouseException } from 'src/common/exceptions/houses/user-not-member-of-house-exception';
import { AcceptOrRejectTaskAssignmentDto } from './dtos/request/accept-or-reject-task-assignment.dto';

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
  async create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: User, @CurrentHouse() house: House) {
    try {
      const task = await this.tasksService.create(createTaskDto, user, house);
      return { task: this.tasksService.toTaskInResponseDto(task) };
    } catch (error) {
      if (error instanceof UserNotMemberOfHouseException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('house/:houseId')
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Get tasks from a house.' })
  @ApiQuery({ name: 'timeStart', required: false, type: String, example: '2024-07-11' })
  @ApiQuery({ name: 'timeEnd', required: false, type: String, example: '2024-07-15' })
  @ApiQuery({ name: 'ownerId', required: false, type: String, example: '2' })
  @ApiQuery({
    name: 'taskStatus',
    required: false,
    enum: TaskStatus,
    example: TaskStatus.DONE,
    description: `Task status:\n
    ${TaskStatus.OPEN} - OPEN,\n
    ${TaskStatus.IN_PROGRESS} - IN_PROGRESS,\n
    ${TaskStatus.DONE} - DONE`,
  })
  @ApiQuery({ name: 'assigneeId', required: false, type: String, example: '2' })
  @ApiQuery({
    name: 'assigneeStatus',
    required: false,
    enum: TaskAssignmentStatus,
    example: TaskAssignmentStatus.PENDING,
    description: `Task assignment status:\n
    ${TaskAssignmentStatus.PENDING} for PENDING\n
    ${TaskAssignmentStatus.ACCEPTED} for ACCEPTED\n
    ${TaskAssignmentStatus.REJECTED} for REJECTED\n
    ${TaskAssignmentStatus.DONE} for DONE`,
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

  @Get('house/:houseId/home')
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Get home page tasks.' })
  @ApiResponse({ status: 200, description: 'Home page tasks found.', type: GetTasksResponseDto })
  @ApiResponse({
    status: 401,
    description: 'Needs sign in to get home page tasks.',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Only house member can get home page tasks.',
    type: ForbiddenErrorResponseDto,
  })
  @Serialize(GetTasksResponseDto)
  async findHomePageTasks(@CurrentHouse() house: House, @CurrentUser() user: User) {
    const tasks = await this.tasksService.findUserHomePageTasks(house, user);
    return { tasks };
  }

  @Get('house/:houseId/assigned')
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Get assigned tasks.' })
  @ApiResponse({ status: 200, description: 'Assigned tasks found.', type: GetTasksResponseDto })
  @ApiResponse({
    status: 401,
    description: 'Needs sign in to get assigned tasks.',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Only house member can get assigned tasks.',
    type: ForbiddenErrorResponseDto,
  })
  @Serialize(GetTasksResponseDto)
  async findAssignedTasks(@CurrentHouse() house: House, @CurrentUser() user: User) {
    const tasks = await this.tasksService.findAssignedTasks(house, user);
    return { tasks };
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
  @ApiResponse({ status: 200, description: 'Task assigned.', type: AssignTaskResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to assign task.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only task owner can assign the task.', type: ForbiddenErrorResponseDto })
  @ApiBody({ type: AssignTaskDto })
  assign(@CurrentTask() task: Task, @Body() assignTaskDto: AssignTaskDto) {
    try {
      return { assignments: this.tasksService.assign(task, assignTaskDto.assigneeIds) };
    } catch (error) {
      if (error instanceof UsersNotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
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
  @ApiBody({ type: AcceptOrRejectTaskAssignmentDto })
  async acceptOrReject(
    @CurrentTask() task: Task,
    @CurrentUser() user: User,
    @Body('status') status: TaskAssignmentStatus,
  ) {
    try {
      const isTaskAccepted = await this.tasksService.isTaskAccepted(task);
      if (isTaskAccepted && status === TaskAssignmentStatus.ACCEPTED) {
        throw new BadRequestException('Task is already accepted by someone.');
      }

      if (status === TaskAssignmentStatus.REJECTED) {
        return { result: this.tasksService.reject(task, user) };
      }
      return { result: this.tasksService.accept(task, user) };
    } catch (error) {
      if (error instanceof TaskAssignmentNotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
