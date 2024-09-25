import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './services/tasks.service';
// import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dtos/request/create-task.dto';
import { User } from '../users/entities/user.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findByDatePeriod: jest.fn(),
            findUserHomePageTasks: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            assign: jest.fn(),
            respondToAssignment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        accessLevel: 0,
        dueTime: new Date(),
        assigneesId: [1, 2],
      };
      const user: User = { id: 1 } as User;
      const expectedResult = { id: 1, ...createTaskDto };
      // jest.spyOn(tasksService, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createTaskDto, user);
      expect(result).toEqual(expectedResult);
      expect(tasksService.create).toHaveBeenCalledWith(createTaskDto, user);
    });
  });
});
