import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { PushPayloadDto } from '../dto/push-payload.dto';

@Injectable()
export class FcmHandler {
  private fcmService: admin.messaging.Messaging;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: 'https://your-project-id.firebaseio.com',
      });
    }
    this.fcmService = admin.messaging();
  }

  async sendPushNotification(deviceToken: string, payload: PushPayloadDto): Promise<void> {
    try {
      const message = {
        token: deviceToken,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data,
      };

      const response = await this.fcmService.send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Error sending FCM push notification');
    }
  }
}
