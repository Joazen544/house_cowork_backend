import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { EmailDetail, EmailSendStatus } from '../entities/email-detail.entity';
import { SendEmailRecordDto } from '../dtos/send-email-record.dto';
import { EmailTemplateKey } from '../enums/email-template-key.enum';


@Injectable()
export class EmailRecordRepository extends BaseRepository<EmailDetail> {
  constructor(
    @InjectRepository(EmailDetail) private readonly detailRepo: Repository<EmailDetail>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(EmailDetail, dataSource);
  }

  async findOneWithTemplate(id: number) {
    return await this.detailRepo.findOne({
      where: { id },
      relations: ['emailTemplate'],
    });
  }

  async updateStatus(id: number, status: EmailSendStatus) {
    return await this.detailRepo.update({ id }, { status });
  }

  private async createEmailRecord(emailRecordDto: SendEmailRecordDto<EmailTemplateKey>) {
    const detailRecord = this.detailRepo.create(emailRecordDto);
    await this.detailRepo.save(detailRecord);
    return detailRecord;
  }

  async saveEmailRecord(sendRecordDto: SendEmailRecordDto<EmailTemplateKey>): Promise<number> {
    const detailRecord = await this.detailRepo.save(sendRecordDto)

    return detailRecord.id
  }

  async markStatus(id: number, status: EmailSendStatus, errorMessage: string) {
    return await this.detailRepo.update({ id }, { status: status, errorMessage });
  }

  async findPendingRecords() {
    return await this.detailRepo.find({
      where: { status: EmailSendStatus.PENDING },
    });
  }


}
