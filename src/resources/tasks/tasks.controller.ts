import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Req, Query } from '@nestjs/common';
import { CreateTaskDto } from './dtos/request/create-task.dto';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from 'src/resources/users/entities/user.entity';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestErrorResponseDto,
  ForbiddenErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/dto/errors/errors.dto';
import { CreateTaskResponseDto } from './dtos/response/create-task-response.dto';
import { Express } from 'express';
import { HouseMemberGuard } from 'src/guards/house-member.guard';
import { TasksResponseDto } from './dtos/response/tasks-response.dto';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('house/:houseId')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, HouseMemberGuard)
  @ApiOperation({ summary: 'Create a task' })
  @ApiResponse({ status: 201, description: 'Task created.', type: CreateTaskResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, some property is missed.', type: BadRequestErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to create a house.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only house member can create task.', type: ForbiddenErrorResponseDto })
  @ApiBody({ type: CreateTaskDto })
  @Serialize(CreateTaskResponseDto)
  createTask(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get('house/:houseId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, HouseMemberGuard)
  @ApiOperation({ summary: 'Get tasks from a house.' })
  @ApiQuery({ name: 'timeStart', required: false, type: String, example: '2024-07-11' })
  @ApiQuery({ name: 'timeEnd', required: false, type: String, example: '2024-07-15' })
  @ApiResponse({ status: 200, description: 'Task created.', type: TasksResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to get tasks.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only house member can get task.', type: ForbiddenErrorResponseDto })
  getTasks(@Query('timeStart') timeStart: string, @Query('timeEnd') timeEnd: string) {
    let startDate: Date;

    if (timeStart) {
      startDate = new Date(timeStart);
    } else {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 40);
    }
    const endDate = timeEnd ? new Date(timeEnd) : null;

    return this.tasksService.findByDatePeriod(startDate, endDate);
  }
}
