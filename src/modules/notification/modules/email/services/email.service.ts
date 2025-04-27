import { Inject, Injectable } from '@nestjs/common';
import { EmailTemplatesRepository } from '../repositories/email-templates.repository';
import { EmailSendDetails } from '../dtos/email-send-detail.dto';
import { EmailRecordRepository as EmailRecordRepository } from '../repositories/email-record.repository';
import { EmailSendRecord, EmailSendStatus } from '../entities/email-send-record.entity';
import { EmailTemplateKey } from '../enums/email-template-key.enum';
import { EmailSendService } from './email-send.service';
import { EmailTemplateLanguage } from '../enums/email-template-language.enum';
import { EmailSendResult } from '../interfaces/email-send-result.interface';
import { EmailSendOption } from '../dtos/email-send-option.dto';
import { EmailTemplate } from '../entities/email-template.entity';
import { NotificationType } from 'src/common/dto/notification-type.enum';
import { Language } from 'src/common/dto/laguage-type.enum';


@Injectable()
export class EmailService {
  constructor(
    private readonly emailTemplatesRepository: EmailTemplatesRepository,
    private readonly emailRecordRepository: EmailRecordRepository,
    private readonly sendEmailService: EmailSendService,
  ) { }

  async send(sendOptions: EmailSendOption<EmailTemplateKey>): Promise<EmailSendResult> {
    this.isSendOptionsValid(sendOptions);
    try {
      const template = await this.getTemplate(sendOptions.templateKey, sendOptions.language)
      const record = await this.createEmailRecord(sendOptions, template.id)
      await this.processEmailDelivery(sendOptions, template, record.id)
      return {
        isSuccess: true,
        sendAt: record.sendAt
      }
    } catch (error) {
      return {
        isSuccess: false,
        sendAt: new Date()
      }
    }
  }

  private async createEmailRecord(options: EmailSendOption<EmailTemplateKey>, templateId: number): Promise<EmailSendRecord> {
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

  findEmailTemplateKey(type: NotificationType): EmailTemplateKey {
    if (type == NotificationType.OTP) return EmailTemplateKey.USER_SIGNUP_OTP
    throw ("this type should not be email:" + type)
  }

  async getTemplate(key: EmailTemplateKey, language: Language): Promise<EmailTemplate> {
    const template = await this.emailTemplatesRepository.findLatestVersionByKeyAndLanguage(key, language)
    if (!template) {
      throw new Error(`Email template not found for key: ${key} and language: ${language}`);
    }
    return template
  }

  private async isSendOptionsValid(sendOptions: EmailSendOption<EmailTemplateKey>) {
    if (!sendOptions.to || !sendOptions.templateKey || !sendOptions.language) {
      throw new Error("Missing required email send options");
    }
  }

  private async processEmailDelivery(sendOptions: EmailSendOption<EmailTemplateKey>, template: EmailTemplate, recordId: number) {
    try {
      const detail = new EmailSendDetails(
        sendOptions.from,
        sendOptions.to,
        template.subject,
        template.bodyHTML,
        template.bodyText
      )
      await this.emailRecordRepository.updateEmailRecordStatus(recordId, EmailSendStatus.SENT);
      const clientResult = await this.sendEmailService.sendEmail(detail);
      return {
        isSuccess: clientResult.isSuccess,
        sendAt: clientResult.sendAt
      }
    } catch (error) {
      this.emailRecordRepository.updateEmailRecordStatus(recordId, EmailSendStatus.FAILED)
    }
  }
}
