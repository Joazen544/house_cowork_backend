import { Inject, Injectable } from '@nestjs/common';
import { EmailTemplatesRepository } from '../repositories/email-templates.repository';
import { EmailSendDetails } from '../dtos/email-send-detail.dto';
import { EmailRecordRepository as EmailRecordRepository } from '../repositories/email-record.repository';
import { EmailSendRecord, EmailSendStatus } from '../entities/email-send-record.entity';
import { EmailTemplateKey } from '../enums/email-template-key.enum';
import { EmailSendService } from './email-send.service';
import { EmailTemplateLanguage } from '../enums/email-template-language.enum';
import { EmailSendResult } from '../interfaces/email-send-result';
import { EmailSendOptions } from '../dtos/email-send-option.dto';
import { EmailTemplate } from '../entities/email-template.entity';


@Injectable()
export class EmailService {
  constructor(
    private readonly emailTemplatesRepository: EmailTemplatesRepository,
    private readonly emailRecordRepository: EmailRecordRepository,
    private readonly sendEmailService: EmailSendService,
  ) { }

  async send(sendOptions: EmailSendOptions<EmailTemplateKey>): Promise<EmailSendResult> {
    this.isSendOptionsValid(sendOptions);

    const template = await this.getTemplate(sendOptions.templateKey, sendOptions.language)
    const record = await this.createEmailRecord(sendOptions, template.id)
    try {
      return await this.processEmailDelivery(sendOptions, template, record.id)
    } catch (error) {
      await this.emailRecordRepository.updateEmailRecordStatus(record.id, EmailSendStatus.FAILED)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
        sendAt: record.sendAt
      }
    }
  }

  async createEmailRecord(options: EmailSendOptions<EmailTemplateKey>, templateId: number): Promise<EmailSendRecord> {
    const newRecord = new EmailSendRecord()

    Object.assign(newRecord, {
      to: options.to,
      createdAt: new Date(),
      sendAt: options.sendAt || new Date(),
      emailTemplateKey: options.templateKey,
      emailTemplateId: templateId,
      language: options.language,
      status: EmailSendStatus.PENDING,
    })

    return this.emailRecordRepository.create(newRecord)
  }

  async getTemplate(key: EmailTemplateKey, language: EmailTemplateLanguage): Promise<EmailTemplate> {
    const template = await this.emailTemplatesRepository.findLatestVersionByKeyAndLanguage(key, language)
    if (!template) {
      throw new Error(`Email template not found for key: ${key} and language: ${language}`);
    }
    return template
  }

  private async isSendOptionsValid(sendOptions: EmailSendOptions<EmailTemplateKey>) {
    if (!sendOptions.to || !sendOptions.templateKey || !sendOptions.language) {
      throw new Error("Missing required email send options");
    }
  }

  private async processEmailDelivery(sendOptions: EmailSendOptions<EmailTemplateKey>, template: EmailTemplate, recordId: number): Promise<EmailSendResult> {
    try {
      const detail = new EmailSendDetails(
        sendOptions.to, template.subject, template.bodyHTML, template.bodyText
      )
      await this.emailRecordRepository.updateEmailRecordStatus(recordId, EmailSendStatus.SENT);
      return await this.sendEmailService.sendEmail(detail)
    } catch (error) {
      await this.emailRecordRepository.updateEmailRecordStatus(recordId, EmailSendStatus.FAILED);
      throw error
    }
  }
}
