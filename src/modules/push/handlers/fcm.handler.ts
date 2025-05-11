import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { PushPayloadDto } from '../dto/push-payload.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FcmHandler {
  private fcmService: admin.messaging.Messaging;

  constructor(private configService: ConfigService) {
    const firebaseCredentials = this.configService.get<string>('FIREBASE_CREDENTIAL_BASE64');

    if (!firebaseCredentials) {
      throw new Error('Firebase credentials not found');
    }

    const decodedCredentials = Buffer.from(firebaseCredentials, 'base64').toString('utf8');

    const databaseUrl = this.configService.get<string>('FIREBASE_DATABASE_URL');

    if (!databaseUrl) {
      throw new Error('Firebase database URL not found');
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(decodedCredentials)),
        databaseURL: databaseUrl,
      });
    }
    this.fcmService = admin.messaging();
  }

  async sendPushNotification(deviceToken: string, payload: PushPayloadDto): Promise<void> {
    try {
      const message = {
        token: deviceToken,
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
