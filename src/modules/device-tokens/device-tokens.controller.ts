import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceTokensService } from './device-tokens.service';
import { BadRequestErrorResponseDto, UnauthorizedErrorResponseDto } from 'src/common/dto/errors/errors.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('device-tokens')
@ApiTags('device-tokens')
export class DeviceTokensController {
  // constructor(private readonly deviceTokensService: DeviceTokensService) {}
  // @Post('')
  // @ApiOperation({ summary: 'Create device token' })
  // @ApiResponse({ status: 201, description: 'Device token created!' })
  // @ApiResponse({ status: 400, description: 'Bad request.', type: BadRequestErrorResponseDto })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Needs sign in to create device token.',
  //   type: UnauthorizedErrorResponseDto,
  // })
  // create(@Body() createDeviceTokenDto: CreateDeviceTokenDto, @CurrentUser() user: User) {
  //   return this.deviceTokensService.create(createDeviceTokenDto, user);
  // }
}
