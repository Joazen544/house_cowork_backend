import { BaseRepository } from 'src/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PushNotificationRecord } from '../entities/push-notification-record.entity';

@Injectable()
export class PushNotificationRecordsRepository extends BaseRepository<PushNotificationRecord> {
  constructor(
    @InjectRepository(PushNotificationRecord)
    private readonly pushNotificationRecordRepo: Repository<PushNotificationRecord>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(PushNotificationRecord, dataSource);
  }
}
