import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateUserDto } from './dtos/request/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            areUsersInSameHouse: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return user info if user is the same', async () => {
      const user: User = { id: 1 } as User;
      const result = await controller.findOne(1, user);
      expect(result).toEqual({ user });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
      await expect(controller.findOne(2, { id: 1 } as User)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if users are not in the same house', async () => {
      const targetUser: User = { id: 2 } as User;
      jest.spyOn(usersService, 'findOne').mockResolvedValue(targetUser);
      jest.spyOn(usersService, 'areUsersInSameHouse').mockReturnValue(false);
      await expect(controller.findOne(2, { id: 1 } as User)).rejects.toThrow(ForbiddenException);
    });

    it('should return target user info if users are in the same house', async () => {
      const targetUser: User = { id: 2 } as User;
      jest.spyOn(usersService, 'findOne').mockResolvedValue(targetUser);
      jest.spyOn(usersService, 'areUsersInSameHouse').mockReturnValue(true);
      const result = await controller.findOne(2, { id: 1 } as User);
      expect(result).toEqual({ user: targetUser });
    });
  });

  describe('update', () => {
    it('should update user info', async () => {
      const user: User = { id: 1 } as User;
      const updateUserDto: UpdateUserDto = { name: 'New Name' } as UpdateUserDto;
      const updatedUser: User = { id: 1, name: 'New Name' } as User;
      jest.spyOn(usersService, 'update').mockResolvedValue(updatedUser);
      const result = await controller.update(user, updateUserDto);
      expect(result).toEqual({ user: updatedUser });
    });
  });
});
