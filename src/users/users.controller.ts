import {
  Body,
  Controller,
  Get,
  Param,
  Session,
  ParseIntPipe,
  Post,
  Patch,
  Query,
  ValidationPipe,
  NotFoundException,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from './entities/user.entity';
import { SigninUserDto } from './dtos/request/signin-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserResponseDto } from './dtos/response/create-user-response.dto';
import {
  BadRequestErrorResponseDto,
  ForbiddenErrorResponseDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/dto/errors/errors.dto';
import { UserInfoResponseDto } from './dtos/response/user-info-response.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @Serialize(CreateUserResponseDto)
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created!', type: CreateUserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, some property is missed.', type: BadRequestErrorResponseDto })
  @ApiBody({ type: CreateUserDto })
  async create(@Body(new ValidationPipe()) body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password, body.name);

    session.userId = user.id;

    const accessToken = 'asdf';

    return { user, accessToken };
  }

  @Post('signin')
  @Serialize(CreateUserResponseDto)
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'User signin!', type: CreateUserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.', type: NotFoundErrorResponseDto })
  @ApiBody({ type: SigninUserDto })
  async signin(@Body() body: SigninUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;

    const accessToken = 'asdf';

    return { user: user, accessToken: accessToken };
  }

  @Post('signout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse({ status: 200, description: 'User signout!' })
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get(':id/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a user info' })
  @ApiResponse({ status: 200, description: 'User info found!', type: UserInfoResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to get user info.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Can only find user info in family', type: ForbiddenErrorResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.', type: NotFoundErrorResponseDto })
  @Serialize(UserInfoResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne({
      id,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Patch('/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({ status: 200, description: 'User info updated!', type: UserInfoResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, some property is missed.', type: BadRequestErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to update user info.', type: UnauthorizedErrorResponseDto })
  @Serialize(UserInfoResponseDto)
  update(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
    return this.usersService.update(user.id, body);
  }

  // @Get()
  // findAllUsers(@Query('email') email: string) {
  //   return this.usersService.find(email);
  // }

  // @Delete(':id')
  // removeUser(@Param('id', ParseIntPipe) id: number) {
  //   return this.usersService.remove(id);
  // }

  // @Get('who')
  // @Serialize(CreateUserResponseDto)
  // whoAmI(@CurrentUser() user: User) {
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }

  //   const accessToken = 'asdf';
  //   return { user: user, accessToken: accessToken };
  // }
}
