import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserResponseDto } from './dto/response/update-user-response.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { CreateUserDto } from './dto/request/create-user.dto';
import { BadRequestErrorResponseDto, NotFoundErrorResponseDto } from '../../common/dto/errors/errors.dto';
import { SigninUserDto } from './dto/request/signin-user.dto';
import { Public } from './decorators/public.decorator';
import { CreateUserResponseDto } from './dto/response/create-user-response.dto';
import { EmailInUseException } from 'src/common/exceptions/auth/email-in-use.exception';
import { WrongPasswordException } from 'src/common/exceptions/auth/wrong-password.exception';
import { EmailNotFoundException } from 'src/common/exceptions/auth/email-not-found.exception';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Serialize(CreateUserResponseDto)
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created!', type: CreateUserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, some property is missed.', type: BadRequestErrorResponseDto })
  @ApiBody({ type: CreateUserDto })
  async create(@Body(new ValidationPipe()) body: CreateUserDto) {
    if (body.password !== body.passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }

    try {
      const { user, accessToken } = await this.authService.signUp(body.email, body.password, body.name);

      return { user, accessToken };
    } catch (error) {
      if (error instanceof EmailInUseException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post('signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Serialize(UpdateUserResponseDto)
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'User signin!', type: UpdateUserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.', type: NotFoundErrorResponseDto })
  @ApiBody({ type: SigninUserDto })
  async signin(@Body() body: SigninUserDto) {
    try {
      const { user, accessToken } = await this.authService.signIn(body.email, body.password);

      return { user: user, accessToken: accessToken };
    } catch (error) {
      if (error instanceof WrongPasswordException) {
        throw new NotFoundException('User not found');
      }
      if (error instanceof EmailNotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  @Get('test')
  @Public()
  async test() {
    return 'test 123';
  }
}
