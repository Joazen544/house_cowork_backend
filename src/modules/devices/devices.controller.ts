import { Controller, Post, Body } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DeviceRegistrationDto } from './dto/device-registration.dto';

@Controller({ path: 'devices', version: '1' })
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  registerDevice(@Body() dto: DeviceRegistrationDto) {
    console.log(dto);
    return this.devicesService.registerDevice(dto);
  }
}
