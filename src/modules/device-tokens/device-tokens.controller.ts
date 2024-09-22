import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceTokensService } from './device-tokens.service';

@Controller('device-tokens')
@ApiTags('device-tokens')
export class DeviceTokensController {
  constructor(private readonly deviceTokensService: DeviceTokensService) {}
}
