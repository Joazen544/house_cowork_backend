import { Injectable } from '@nestjs/common';
import { DevicesService } from '../../devices/devices.service';
import { PushNotificationDto } from '../dto/push-notification.dto';
import { PushTemplatesRepository } from '../repositories/push-templates.repository';
import { PushNotificationRecord } from '../entities/push-notification-record.entity';
import { PushTemplate } from '../entities/push-template.entity';
import { Device } from '../../devices/entities/device.entity';
import { PushNotificationRecordsRepository } from '../repositories/push-notification-records.repository';
import { SendNotificationService } from './send-notification.service';
@Injectable()
export class PushService {
  constructor(
    private readonly devicesService: DevicesService,
    private readonly pushTemplatesRepository: PushTemplatesRepository,
    private readonly pushNotificationRecordsRepository: PushNotificationRecordsRepository,
    private readonly sendNotificationService: SendNotificationService,
  ) {}

  async sendPushNotification(pushNotificationDto: PushNotificationDto) {
    const devices = await this.devicesService.getByUserId(pushNotificationDto.targetUserId);

    if (devices.length === 0) {
      console.error(
        `No devices found for user ${pushNotificationDto.targetUserId}, pushTemplateKey=${pushNotificationDto.pushTemplateKey}`,
      );
      return;
    }

    // get template by key
    const pushTemplate = await this.pushTemplatesRepository.findOneByKey(pushNotificationDto.pushTemplateKey);

    if (!pushTemplate) {
      console.error(`Push template not found for key ${pushNotificationDto.pushTemplateKey}`);
      return;
    }

    // create push notification records for each device
    const pushNotificationRecords = await this.createPushNotificationRecords(
      devices,
      pushTemplate,
      pushNotificationDto,
    );
    // send push notification to each device

    await Promise.all(pushNotificationRecords.map((record) => this.sendNotificationService.send(record)));
  }

  private async createPushNotificationRecords(
    devices: Device[],
    pushTemplate: PushTemplate,
    pushNotificationDto: PushNotificationDto,
  ) {
    const pushNotificationRecords = devices.map((device) => {
      const pushNotificationRecord = new PushNotificationRecord();
      pushNotificationRecord.device = device;
      pushNotificationRecord.template = pushTemplate;
      pushNotificationRecord.variables = pushNotificationDto.variables;
      pushNotificationRecord.title = this.replaceVariables(pushTemplate.title, pushNotificationDto.variables);
      pushNotificationRecord.message = this.replaceVariables(pushTemplate.body, pushNotificationDto.variables);
      return pushNotificationRecord;
    });

    return await this.pushNotificationRecordsRepository.saveMany(pushNotificationRecords);
  }

  private replaceVariables(template: string, variables: Record<string, string>) {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, p1) => variables[p1] || match);
  }
}
