import { Body, Controller, Post, ValidationPipe, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserResponseDto } from './dto/response/update-user-response.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CreateUserDto } from './dto/request/create-user.dto';
import { BadRequestErrorResponseDto, NotFoundErrorResponseDto } from '../../common/dto/errors/errors.dto';
import { SigninUserDto } from './dto/request/signin-user.dto';
import { Public } from './decorators/public.decorator';
import { CreateUserResponseDto } from './dto/response/create-user-response.dto';

@Controller('auth')
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
    const { user, accessToken } = await this.authService.signUp(body.email, body.password, body.name, body.nickName);

    return { user, accessToken };
  }

  @Post('signin')
  @Public()
  @Serialize(UpdateUserResponseDto)
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'User signin!', type: UpdateUserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.', type: NotFoundErrorResponseDto })
  @ApiBody({ type: SigninUserDto })
  async signin(@Body() body: SigninUserDto) {
    const { user, accessToken } = await this.authService.signIn(body.email, body.password);

    return { user: user, accessToken: accessToken };
  }

  // @Post('signout')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Sign out' })
  // @ApiResponse({ status: 200, description: 'User signout!' })
  // @ApiResponse({ status: 401, description: 'Needs sign in to sign out.', type: UnauthorizedErrorResponseDto })
  // signOut(@Session() session: any) {
  //   session.userId = null;
  // }
}
