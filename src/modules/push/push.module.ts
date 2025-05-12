import { Module } from '@nestjs/common';
import { PushService } from './services/push.service';
import { DevicesModule } from '../devices/devices.module';
import { FcmHandler } from './handlers/fcm.handler';
import { PushNotificationRecord } from './entities/push-notification-record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushTemplate } from './entities/push-template.entity';
import { PushTemplatesRepository } from './repositories/push-templates.repository';
import { PushNotificationRecordsRepository } from './repositories/push-notification-records.repository';
import { SendNotificationService } from './services/send-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([PushNotificationRecord, PushTemplate]), DevicesModule],
  providers: [
    SendNotificationService,
    PushService,
    FcmHandler,
    PushTemplatesRepository,
    PushNotificationRecordsRepository,
  ],
  exports: [PushService],
})
export class PushModule {}
