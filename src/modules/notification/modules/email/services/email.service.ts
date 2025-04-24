import { Inject, Injectable } from '@nestjs/common';
import { EmailTemplatesRepository } from '../repositories/email-templates.repository';
import { EmailClient } from '../providers/interfaces/email-client.interface';
import { EmailSendOptions } from '../dtos/email-send-options.dto';
import { EmailRecordRepository as EmailRecordRepository } from '../repositories/email-record.repository';
import { EmailDetail, EmailSendStatus } from '../entities/email-detail.entity';
import { EmailTemplate } from '../entities/email-template.entity';
import { EmailTemplateKey } from '../enums/email-template-key.enum';
import { SendEmailRecordDto } from '../dtos/send-email-record.dto';
import { SendEmailService } from './send-email.service';
import { EmailSendService } from './email-template-render.service';
import { EmailTemplateLanguage } from '../enums/email-template-language.enum';
import { EmailDetailDto } from '../dtos/email-detail.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailTemplatesRepository: EmailTemplatesRepository,
    private readonly emailRecordRepository: EmailRecordRepository,
    private readonly sendEmailService: SendEmailService,
    private readonly emailTemplateRenderService: EmailSendService,
  ) { }

  async scheduleEmail(sendDto: SendEmailRecordDto<EmailTemplateKey>): Promise<void> {
    const emailTemplate = await this.findValidEmailTemplate(sendDto.templateKey, sendDto.language);

    const recordId = await this.emailRecordRepository.saveEmailRecord(sendDto);

    if (this.shouldSendImmediately(sendDto.sendAt)) {
      await this.processEmail(recordId);
    }


  }

  private async findValidEmailTemplate(key: EmailTemplateKey, language: EmailTemplateLanguage) {
    const template = await this.emailTemplatesRepository.findLatestVersionByKeyAndLanguage(key, language);
    if (!template) {
      throw new Error('Email template not found');
    }
    return template;
  }

  private async findValidEmail(id: number) {
    const email = await this.emailRecordRepository.findOneWithTemplate(id);
    if (!email) {
      throw new Error('Email not found');
    }
    return email;
  }

  private shouldSendImmediately(sendAt: Date) {
    return sendAt.getTime() <= Date.now()
  }

  private async processEmail(id: number) {
    const email = await this.findValidEmail(id);
    try {
      // send email 
    } catch (error) {
      await this.emailRecordRepository.updateStatus(id, EmailSendStatus.FAILED);
      throw error;
    }
  }





}
