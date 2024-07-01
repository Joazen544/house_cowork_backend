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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Get('who')
  whoAmI(@Session() session: any) {
    return this.usersService.findOne({ id: session.userId });
  }

  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Post('signup')
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

  @Post('signin')
  async signin(@Body() body: SigninUserDto, @Session() session: any) {
    console.log('weee');

    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  signOut(@Session() session: any) {
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
