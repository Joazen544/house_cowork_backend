import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { EmailNotification } from '../entities/email-notification.entity';

@Injectable()
export class EmailNotificationsRepository extends BaseRepository<EmailNotification> {
  constructor(
    @InjectRepository(EmailNotification) private readonly emailNotificationRepo: Repository<EmailNotification>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(EmailNotification, dataSource);
  }
}
