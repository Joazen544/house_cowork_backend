import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  ForbiddenException,
  Put,
  Post,
  UploadedFile,
  UseInterceptors,
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
} from '../../common/dto/errors/errors.dto';
import { UserInfoResponseDto } from './dtos/response/user-info-response.dto';
import { HouseMembersService } from 'src/modules/houses/modules/house-members/house-members.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private houseMembersService: HouseMembersService,
  ) {}

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

    const targetUser = await this.usersService.findOneBy({ id });
    if (!targetUser) {
      throw new NotFoundException('user not found');
    }

    const isInSameHouse = await this.houseMembersService.areUsersInSameHouse(user.id, targetUser.id);
    if (!isInSameHouse) {
      throw new ForbiddenException('Can only find user info in family');
    }
    return { user: targetUser };
  }

  @Put('/profile')
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

  @Post('avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload avatar' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Avatar uploaded!', type: UserInfoResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to upload avatar.', type: UnauthorizedErrorResponseDto })
  @Serialize(UserInfoResponseDto)
  async uploadAvatar(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
    return { user: await this.usersService.uploadProfileAvatar(user, file) };
  }
}
