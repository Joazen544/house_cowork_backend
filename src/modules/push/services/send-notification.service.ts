import { Injectable } from '@nestjs/common';
import { PushNotificationRecord } from '../entities/push-notification-record.entity';
import { FcmHandler } from '../handlers/fcm.handler';
import { PushPayloadDto } from '../dto/push-payload.dto';
import { PushProvider } from 'src/modules/devices/entities/device.entity';

@Injectable()
export class SendNotificationService {
  constructor(private readonly fcmHandler: FcmHandler) {}

  async send(pushNotificationRecord: PushNotificationRecord) {
    const device = pushNotificationRecord.device;
    const message = pushNotificationRecord.message;
    const title = pushNotificationRecord.title;
    const targetPage = pushNotificationRecord.targetPage;

    const payload = new PushPayloadDto(title, message, targetPage);

    if (device.provider === PushProvider.FCM) {
      await this.fcmHandler.sendPushNotification(device.pushToken, payload);
    } else {
      throw new Error('Unsupported push provider');
    }
  }
}
