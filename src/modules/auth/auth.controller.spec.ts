import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { SigninUserDto } from './dto/request/signin-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('create', () => {
    it('should create a user and return user and accessToken', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        passwordConfirm: 'password',
        name: 'Test User',
      };

      const result = {
        user: {
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          avatarKey: 'avatarKey',
        } as User,
        accessToken: 'someAccessToken',
      };

      jest.spyOn(authService, 'signUp').mockResolvedValue(result);

      expect(await authController.create(createUserDto)).toEqual(result);
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        passwordConfirm: 'differentPassword',
        name: 'Test User',
      };

      await expect(authController.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('signin', () => {
    it('should sign in a user and return user and accessToken', async () => {
      const signinUserDto: SigninUserDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const result = {
        user: {
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          avatarKey: 'avatarKey',
        } as User,
        accessToken: 'someAccessToken',
      };

      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      expect(await authController.signin(signinUserDto)).toEqual(result);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const signinUserDto: SigninUserDto = {
        email: 'notfound@example.com',
        password: 'password',
      };

      jest.spyOn(authService, 'signIn').mockRejectedValue(new NotFoundException());

      await expect(authController.signin(signinUserDto)).rejects.toThrow(NotFoundException);
    });
  });
});
