import {
  Body,
  Controller,
  Delete,
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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { SigninUserDto } from './dtos/request/signin-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created!', type: User })
  @ApiResponse({
    status: 400,
    description: 'Bad request, some property is missed.',
  })
  @ApiBody({ type: CreateUserDto })
  async createUser(
    @Body(new ValidationPipe()) body: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signUp(
      body.email,
      body.password,
      body.name,
    );

    session.userId = user.id;
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Post('signin')
  async signin(@Body() body: SigninUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  signOut(@Session() session: any) {
    console.log(session.userId);
    session.userId = null;
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
