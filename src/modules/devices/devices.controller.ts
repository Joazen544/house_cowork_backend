import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DeviceRegistrationDto } from './dto/device-registration.dto';
import { ApiBody } from '@nestjs/swagger';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SimpleResponseDto } from '../../common/dto/response/simple-response.dto';
import { BadRequestErrorResponseDto } from '../../common/dto/errors/errors.dto';
import { UnauthorizedErrorResponseDto } from '../../common/dto/errors/errors.dto';
import { DeviceRegistrationFromRequestDto } from './dto/device-registration-from-request.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@Controller({ path: 'devices', version: '1' })
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a device' })
  @ApiResponse({ status: 201, description: 'Device registered.', type: SimpleResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, some property is missed.', type: BadRequestErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to register a device.', type: UnauthorizedErrorResponseDto })
  @ApiBody({ type: DeviceRegistrationFromRequestDto })
  @Serialize(SimpleResponseDto)
  async registerDevice(@Body() dto: DeviceRegistrationFromRequestDto, @CurrentUser() user: User) {
    const registrationDto: DeviceRegistrationDto = {
      ...dto,
      userId: user.id,
    };
    const device = await this.devicesService.registerDevice(registrationDto);
    if (device) {
      return {
        result: true,
      };
    }
    return {
      result: false,
    };
  }
}
