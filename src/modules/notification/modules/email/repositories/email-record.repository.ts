import { DataSource, LessThan, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { EmailSendRecord, EmailSendStatus } from '../entities/email-send-record.entity';


@Injectable()
export class EmailRecordRepository extends BaseRepository<EmailSendRecord> {
  constructor(
    @InjectRepository(EmailSendRecord) private readonly detailRepo: Repository<EmailSendRecord>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(EmailSendRecord, dataSource);
  }

  async updateEmailRecordStatus(recordId: number, status: EmailSendStatus) {
    this.update(recordId, { status: status })
  }


}
