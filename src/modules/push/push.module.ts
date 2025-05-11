import { Module } from '@nestjs/common';
import { PushService } from './services/push.service';
import { DevicesModule } from '../devices/devices.module';
import { FcmHandler } from './handlers/fcm.handler';

@Module({
  imports: [DevicesModule],
  providers: [PushService, FcmHandler],
  exports: [PushService],
})
export class PushModule {}
