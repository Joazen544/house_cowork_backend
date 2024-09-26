import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { User } from './entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  BadRequestErrorResponseDto,
  ForbiddenErrorResponseDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/common/dto/errors/errors.dto';
import { UserInfoResponseDto } from './dtos/response/user-info-response.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a user info' })
  @ApiResponse({ status: 200, description: 'User info found!', type: UserInfoResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to get user info.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Can only find user info in family', type: ForbiddenErrorResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.', type: NotFoundErrorResponseDto })
  @Serialize(UserInfoResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    if (id === user.id) {
      return { user };
    }

    const targetUser = await this.usersService.findOne({ id });
    if (!targetUser) {
      throw new NotFoundException('user not found');
    }

    const isInSameHouse = this.usersService.areUsersInSameHouse(user, targetUser);
    if (!isInSameHouse) {
      throw new ForbiddenException('Can only find user info in family');
    }
    return { user: targetUser };
  }

  @Patch('/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({ status: 200, description: 'User info updated!', type: UserInfoResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, some property is missed.', type: BadRequestErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to update user info.', type: UnauthorizedErrorResponseDto })
  @ApiBody({ type: UpdateUserDto })
  @Serialize(UserInfoResponseDto)
  async update(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
    return { user: await this.usersService.update(user, body) };
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
